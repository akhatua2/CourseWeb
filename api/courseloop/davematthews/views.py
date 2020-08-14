from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import HttpResponse, Http404, JsonResponse
import json
from davematthews.models import Student, FrqAssignment, WsAssignment, Submission, FrqSubmission
from django.shortcuts import render, redirect, get_object_or_404

from .serializers import SubmissionSerializer, FrqSubmissionSerializer, WsAssignmentSerializer, FrqAssignmentSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from PIL import Image
import pytesseract

from uuid import uuid4

import pyrebase
from gensim import corpora, models, similarities
import jieba

config = {
  "apiKey": "AIzaSyCy4CEw_-p-zwId4S9lJcPHoS4LfIRF968",
  "authDomain": "courseloop-95744.firebaseapp.com",
  "databaseURL": "https://courseloop-95744.firebaseio.com",
  "storageBucket": "courseloop-95744.appspot.com",
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

# Create your views here.
def test(request):
    # data = json.loads(json.dumps(request.data))
    retrieved_data = {"name":"Bobby", "YEE":"EEEEEE","grade":"93.4"}
    return JsonResponse(retrieved_data)

def frq_submission(request, frq_id):
    return render(request, 'davematthews/frq_submit.html')

def ws_submission(request, ws_id):
    return render(request, 'davematthews/img_submit.html')


def submission_text(image_field):
    return pytesseract.image_to_string(Image.open(image_field))


def ta_view(request, section_id):

    course_title = db.child("sandbox").child(section_id).get().val()["course"]
    section = db.child("sandbox").child(section_id).get().val()["section"]

    students_data = []
    students = get_section_students(section_id)
    for student in students:
        student_data = {"id":student}
        student_data["grade"] = get_section_grade(student, section_id)["grade"]
        students_data.append(student_data)

    assignments_data = []
    assignments = get_section_assignments(section_id)
    for assignment in assignments:
        assignment_data = {"id": assignment}
        assignment_data["assignment_title"] = db.child("sandbox").child(assignment).get().val()["title"]
        assignment_data["possible_points"] = db.child("sandbox").child(assignment).get().val()["total_points"]
        assignments_data.append(assignment_data)

    submissions_data = []
    for student in students:
        my_section_submissions = get_section_submissions(student, section_id)
        for submission in my_section_submissions:
            submission["assignment_title"] = db.child("sandbox").child(str(submission["assignment"])).get().val()["title"]
            submission["possible_points"] = db.child("sandbox").child(str(submission["assignment"])).get().val()["total_points"]
            submissions_data.append(submission)

    context = {
        "course":course_title,
        "section": section,
        "section_id": section_id,
        "assignments": assignments_data,
        "students": students_data,
        "submissions": submissions_data,
    }
    return render(request, 'davematthews/section_ta.html', context=context)


# create ws submission + grades + updates firebase DB
@api_view(['POST'])
def ws_grade(request, ws_id):
    print("breh")
    if request.method == 'POST':

        print("breh")
        subs_serializer = SubmissionSerializer(data=request.data)
        print(request.data)
        user = request.data["user"]
        if subs_serializer.is_valid():
            print("breh")
            subs_serializer.save()
            subs = Submission.objects.all()
            latest_sub = subs[len(subs) - 1]
            print("breh")
            sub_img = latest_sub.image
            print("breh")
            itt = submission_text(sub_img)
            latest_sub.content = itt
            latest_sub.ws = WsAssignment.objects.get(id=ws_id)
            latest_sub.uuid = uuid4()
            # grade = auto_grade_ws(latest_sub.content)
            print("breh")
            latest_sub.save()

            total_points = db.child("sandbox").child(str(latest_sub.ws.uuid)).get().val()["total_points"]
            print(total_points)
            keywords = db.child("sandbox").child(str(latest_sub.ws.uuid)).get().val()["answers"]
            grade = auto_grade(latest_sub.content, keywords, total_points)
            print(grade)
            latest_sub.points = grade
            latest_sub.save()

            data = {"assignment": str(latest_sub.ws.uuid),
                    "content": latest_sub.content,
                    "points": grade,
                    "type": "WS",
                    "uid": user}

            db.child("sandbox").child(str(latest_sub.uuid)).set(data)

            return Response(subs_serializer.data, status=status.HTTP_201_CREATED)
    return HttpResponse("Something broke!")


@api_view(['POST'])
def add_course(request):
    if request.method == 'POST':
        user = request.data["user"]
        section_id = request.data["section"]

        data = {user: "student"}
        db.child("sandbox").child(section_id).child("students").update(data)
        return Response(data, status=status.HTTP_201_CREATED)
    return HttpResponse("Something broke!")


@api_view(['POST'])
def remove_course(request):
    if request.method == 'POST':
        user = request.data["user"]
        section_id = request.data["section"]

        data = {user: "student"}
        db.child("sandbox").child(section_id).child("students").child(user).remove()
        return Response(data, status=status.HTTP_201_CREATED)
    return HttpResponse("Something broke!")


@api_view(['GET'])
def all_courses(request):

    all_data = db.child("sandbox").get()
    filtered_data = []

    classes = []
    for entry in all_data.each():
        if len(entry.key()) < 15:
            classes.append(entry.val())

    data = classes
    print(data)
    return Response(data, status=status.HTTP_200_OK)



@api_view(['GET'])
def get_my_courses(request):

    print(request.GET)
    user_uid = request.GET["user"]
    print(request.GET["user"])
    all_data = db.child("sandbox").get()
    filtered_data = []

    classes = []
    for entry in all_data.each():
        if len(entry.key()) < 15 and len(entry.key()) > 4:
            classes.append(entry)

    for group in classes:
        details = group.val()
        print(details)
        students = details["students"]
        if user_uid in students:
            filtered_data.append(details)

    data = filtered_data
    return Response(data, status=status.HTTP_200_OK)




@api_view(['GET'])
def get_my_assignments(request):
    print(request.GET)
    user_uid = request.GET["user"]
    print(request.GET["user"])

    all_data = db.child("sandbox").get()
    filtered_data = []
    my_classes = []
    my_assignment_uuids = []

    all_classes = []
    for entry in all_data.each():
        if len(entry.key()) < 15:
            all_classes.append(entry)

    for group in all_classes:
        details = group.val()
        students = details["students"]
        if user_uid in students:
            my_classes.append(details)
            my_assignment_uuids += list(details['assignments'])

    print(my_assignment_uuids)

    for assignment_uuid in my_assignment_uuids:

        work = db.child("sandbox").child(assignment_uuid).get().val()
        if "keywords" in work:
            work["type"] = "FRQ"
        else:
            work["type"] = "WS"

        filtered_data.append(work)

    data = filtered_data
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_work_due(request):
    print(request.GET)
    user_uid = request.GET["user"]
    print(request.GET["user"])

    all_data = db.child("sandbox").get()
    filtered_data = []
    my_classes = []
    my_assignment_uuids = []

    all_classes = []
    for entry in all_data.each():
        if len(entry.key()) < 15:
            all_classes.append(entry)

    for group in all_classes:
        details = group.val()
        students = details["students"]
        if user_uid in students:
            my_classes.append(details)
            my_assignment_uuids += list(details['assignments'])

    print(my_assignment_uuids)

    my_submission_uuids = get_user_submissions(user_uid)
    for assignment_uuid in my_assignment_uuids:
        if assignment_uuid not in my_submission_uuids:
            print(assignment_uuid)
            work = db.child("sandbox").child(assignment_uuid).get().val()
            if "keywords" in work:
                work["type"] = "FRQ"
            else:
                work["type"] = "WS"

            filtered_data.append(work)

    data = filtered_data
    return Response(data, status=status.HTTP_200_OK)


def get_user_submissions(user_uid):
    all_data = db.child("sandbox").get()
    filtered_data = []

    for entry in all_data.each():
        contents = entry.val()
        try:
            if contents["uid"] == user_uid:
                contents_modded = contents
                contents_modded["asn_title"] = db.child("sandbox").child(contents["assignment"]).get().val()["title"]
                filtered_data.append(contents_modded["assignment"])
        except KeyError:
            pass

    return filtered_data


def get_section_submissions(user_uid, section_id):
    all_data = db.child("sandbox").get()

    section_assignments = db.child("sandbox").child(section_id).child("assignments").get().val()

    my_section_submissions = []
    for entry in all_data.each():
        contents = entry.val()
        try:
            if contents["uid"] == user_uid and contents["assignment"] in section_assignments:
                my_section_submissions.append(contents)

        except KeyError:
            pass

    return my_section_submissions

def get_section_students(section_id):
    section_students = db.child("sandbox").child(section_id).child("students").get().val()
    return section_students

def get_section_assignments(section_id):
    section_assignments = db.child("sandbox").child(section_id).child("assignments").get().val()
    return section_assignments


@api_view(["GET"])
def section_assignments(request):
    section_id = request.GET["section"]
    my_section_assignments = get_section_assignments(section_id)
    return Response(my_section_assignments, status=status.HTTP_200_OK)


@api_view(["GET"])
def section_submissions(request):
    user_uid = request.GET["user"]
    section_id = request.GET["section"]
    my_section_submissions = get_section_submissions(user_uid, section_id)
    return Response(my_section_submissions, status=status.HTTP_200_OK)


def get_section_grade(user_uid, section_id):
    my_section_submissions = get_section_submissions(user_uid, section_id)

    my_points = 0
    possible_points = 0

    for submission in my_section_submissions:
        my_points += submission["points"]
        possible_points += db.child("sandbox").child(submission["assignment"]).get().val()["total_points"]

    if possible_points == 0:
        my_section_grade = 100.0
    else:
        my_section_grade = round(100 * (my_points / possible_points), 3)

    data = {"section": section_id, "grade":my_section_grade}
    return data

@api_view(["GET"])
def section_grade(request):
    user_uid = request.GET["user"]
    section_id = request.GET["section"]
    data = get_section_grade(user_uid, section_id)
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
def grade(request):
    print(request.GET)
    user_uid = request.GET["user"]
    print(request.GET["user"])

    all_data = db.child("sandbox").get()
    my_points = 0
    total_points = 0

    for entry in all_data.each():
        contents = entry.val()
        try:
            if contents["uid"] == user_uid:
                my_points += contents["points"]
                total_points += db.child("sandbox").child(contents["assignment"]).get().val()["total_points"]

        except KeyError:
            pass

    if total_points == 0:
        my_grade = 0
    else:
        my_grade = round((my_points/total_points)*100.0, 3)

    data = {"grade": my_grade, "my_points":my_points, "total_points":total_points}
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_my_submissions(request):
    print(request.GET)
    user_uid = request.GET["user"]
    print(request.GET["user"])

    all_data = db.child("sandbox").get()
    filtered_data = []

    for entry in all_data.each():
        contents = entry.val()
        try:
            if contents["uid"] == user_uid:

                contents_modded = contents
                contents_modded["asn_title"] = db.child("sandbox").child(contents["assignment"]).get().val()["title"]
                filtered_data.append(contents_modded)

        except KeyError:
            pass

    data = filtered_data
    return Response(data, status=status.HTTP_200_OK)


def auto_grade(frq_text, keywords, total_points):
    grade = total_points
    texts = [frq_text, ""]
    keyword = keywords

    print(texts[0])
    print(keyword)

    texts = [jieba.lcut(text) for text in texts]
    dictionary = corpora.Dictionary(texts)
    feature_cnt = len(dictionary.token2id)
    corpus = [dictionary.doc2bow(text) for text in texts]
    tfidf = models.TfidfModel(corpus)
    kw_vector = dictionary.doc2bow(jieba.lcut(keyword))
    index = similarities.SparseMatrixSimilarity(tfidf[corpus], num_features=feature_cnt)
    sim = index[tfidf[kw_vector]]
    for i in range(len(sim)):
        print('keyword is similar to text%d: %.2f' % (i + 1, sim[i]))

    scaler = sim[0]
    return round(scaler*grade, 3)

# create frq submission + grades + updates firebase DB
@api_view(['POST'])
def frq_grade(request, frq_id):

    print("breh")

    if request.method == 'POST':

        print("breh")

        print(request.data)
        user = request.data["user"]
        frq_subs_serializer = FrqSubmissionSerializer(data=request.data)
        if frq_subs_serializer.is_valid():
            frq_subs_serializer.save()
            frq_subs = FrqSubmission.objects.all()
            latest_sub = frq_subs[len(frq_subs) - 1]

            print("breh")
            latest_sub.frq = FrqAssignment.objects.get(id=frq_id)
            print("hello")
            latest_sub.uuid = uuid4()
            latest_sub.save()

            total_points = db.child("sandbox").child(str(latest_sub.frq.uuid)).get().val()["total_points"]
            print(total_points)
            keywords = db.child("sandbox").child(str(latest_sub.frq.uuid)).get().val()["keywords"]
            grade = auto_grade(latest_sub.content, keywords, total_points)
            print(grade)
            latest_sub.points = grade
            latest_sub.save()

            print({"assignment": latest_sub.frq.uuid, "content": latest_sub.content, "points": grade})

            data = {"assignment": str(latest_sub.frq.uuid),
                    "content": latest_sub.content,
                    "points": grade,
                    "type": "FRQ",
                    "uid": user}

            db.child("sandbox").child(str(latest_sub.uuid)).set(data)

            return Response(frq_subs_serializer.data, status=status.HTTP_201_CREATED)
    return HttpResponse("Something broke!")


class SubmissionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        posts = Submission.objects.all()
        serializer = SubmissionSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        subs_serializer = SubmissionSerializer(data=request.data)
        if subs_serializer.is_valid():
            subs_serializer.save()
            return Response(subs_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', subs_serializer.errors)
            return Response(subs_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Worksheet Assignments API
class WsAssignmentView(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        assignments = WsAssignment.objects.all()
        serializer = WsAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        asns_serializer = WsAssignmentSerializer(data=request.data)
        if asns_serializer.is_valid():
            asns_serializer.save()

            ws_asns = WsAssignment.objects.all()
            latest_asn = ws_asns[len(ws_asns) - 1]
            latest_asn.uuid = uuid4()
            latest_asn.save()

            data = asns_serializer.data
            data["uuid"] = str(latest_asn.uuid)

            db.child("sandbox").child(str(latest_asn.uuid)).set(data)

            if "section" in request.data:
                section_id = request.data["section"]
                data = {data["uuid"]: "WS"}
                db.child("sandbox").child(section_id).child("assignments").update(data)
                return redirect('/davematthews/section/'+ section_id + '/')
            else:
                return Response(asns_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', asns_serializer.errors)
            return Response(asns_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class FrqSubmissionView(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        posts = FrqSubmission.objects.all()
        serializer = FrqSubmissionSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        subs_serializer = FrqSubmissionSerializer(data=request.data)
        if subs_serializer.is_valid():
            subs_serializer.save()
            return Response(subs_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', subs_serializer.errors)
            return Response(subs_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FrqAssignmentView(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        assignments = FrqAssignment.objects.all()
        serializer = FrqAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        asns_serializer = FrqAssignmentSerializer(data=request.data)
        if asns_serializer.is_valid():
            asns_serializer.save()

            frq_asns = FrqAssignment.objects.all()
            latest_asn = frq_asns[len(frq_asns) - 1]
            latest_asn.uuid = uuid4()
            latest_asn.save()

            data = asns_serializer.data
            data["uuid"] = str(latest_asn.uuid)

            db.child("sandbox").child(str(latest_asn.uuid)).set(data)
            if "section" in request.data:
                section_id = request.data["section"]
                data = {data["uuid"]: "FRQ"}
                db.child("sandbox").child(section_id).child("assignments").update(data)
                return redirect('/davematthews/section/'+ section_id + '/')
            else:
                return Response(asns_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', asns_serializer.errors)
            return Response(asns_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

