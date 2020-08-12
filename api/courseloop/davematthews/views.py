from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import HttpResponse, Http404, JsonResponse
import json
from davematthews.models import Student, FrqAssignment, WsAssignment, Submission, FrqSubmission

from .serializers import SubmissionSerializer, FrqSubmissionSerializer, WsAssignmentSerializer, FrqAssignmentSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from PIL import Image
import pytesseract

from uuid import uuid4

import pyrebase

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


# create ws submission + grades + updates firebase DB
@api_view(['POST'])
def ws_grade(request, ws_id):
    print("breh")
    if request.method == 'POST':

        print("breh")
        subs_serializer = SubmissionSerializer(data=request.data)
        print(request.data)
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

            data = {"assignment": str(latest_sub.ws.uuid),
                    "content": latest_sub.content,
                    "points": latest_sub.points,
                    "type": "WS",}

            db.child("sandbox").child(str(latest_sub.uuid)).set(data)

            return Response(subs_serializer.data, status=status.HTTP_201_CREATED)
    return HttpResponse("Something broke!")


# create frq submission + grades + updates firebase DB
@api_view(['POST'])
def frq_grade(request, frq_id):

    print("breh")

    if request.method == 'POST':

        print("breh")

        print(request.data)

        frq_subs_serializer = FrqSubmissionSerializer(data=request.data)
        if frq_subs_serializer.is_valid():
            frq_subs_serializer.save()
            frq_subs = FrqSubmission.objects.all()
            latest_sub = frq_subs[len(frq_subs) - 1]

            print("breh")
            latest_sub.frq = FrqAssignment.objects.get(id=frq_id)
            print("hello")
            latest_sub.uuid = uuid4()
            # grade = auto_grade_frq(latest_sub.content)
            latest_sub.save()

            print(latest_sub.frq.uuid)
            print({"assignment": latest_sub.frq.uuid, "content": latest_sub.content, "points": latest_sub.points})

            data = {"assignment": str(latest_sub.frq.uuid),
                    "content": latest_sub.content,
                    "points": latest_sub.points,
                    "type": "FRQ",}

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

            return Response(asns_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', asns_serializer.errors)
            return Response(asns_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

