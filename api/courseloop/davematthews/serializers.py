from rest_framework import serializers
from .models import Submission, FrqSubmission, WsAssignment, FrqAssignment

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'


class FrqSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrqSubmission
        fields = '__all__'


class WsAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WsAssignment
        fields = '__all__'


class FrqAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrqAssignment
        fields = '__all__'
