from django.contrib import admin
from davematthews.models import Submission, FrqSubmission, WsAssignment, FrqAssignment
# Register your models here.

admin.site.register(Submission)
admin.site.register(WsAssignment)
admin.site.register(FrqSubmission)
admin.site.register(FrqAssignment)
