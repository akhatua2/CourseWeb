from django.urls import path

from davematthews import views

urlpatterns = [
    path('test/', views.test, name='test'),

    path('submit/frq/<int:frq_id>/', views.frq_submission, name='frq'),
    path('submit/ws/<int:ws_id>/', views.ws_submission, name='ws'),

    path('grade/frq/<int:frq_id>/', views.frq_grade, name='frqgrade'),
    path('grade/ws/<int:ws_id>/', views.ws_grade, name='wsgrade'),

    path('submissions/', views.SubmissionView.as_view(), name='subs_list'),
    path('frqsubmissions/', views.FrqSubmissionView.as_view(), name='frq_subs_list'),

    path('worksheets/', views.WsAssignmentView.as_view(), name='ws_assignments_list'),
    path('frqs/', views.FrqAssignmentView.as_view(), name='frq_assignments_list'),
]