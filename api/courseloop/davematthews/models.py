from django.db import models
from uuid import uuid4

# Create your models here.

class Student(models.Model):
    uuid = models.UUIDField(default=uuid4())
    username = models.CharField(max_length=100, default="-")
    email = models.CharField(max_length=100, default="-")
    grade = models.FloatField(default=0.0)

class FrqAssignment(models.Model):
    uuid = models.UUIDField(default=uuid4())
    title = models.CharField(max_length=100, default="-")
    total_points = models.IntegerField(default=10)
    keywords = models.CharField(max_length=100, default="-")

    def __str__(self):
        return self.title

class WsAssignment(models.Model):
    uuid = models.UUIDField(default=uuid4())
    title = models.CharField(max_length=100, default="-")
    total_points = models.IntegerField(default=10)
    answers = models.CharField(max_length=100, default="-")

    def __str__(self):
        return self.title

class Submission(models.Model):
    uuid = models.UUIDField(default=uuid4())
    ws = models.ForeignKey(WsAssignment, on_delete=models.CASCADE, blank=True, default=6)
    title = models.CharField(max_length=100)
    points = models.IntegerField(default=0)
    image = models.ImageField(upload_to='post_images')
    content = models.TextField(default="-")

    def __str__(self):
        return self.title


class FrqSubmission(models.Model):
    uuid = models.UUIDField(default=uuid4())
    frq = models.ForeignKey(FrqAssignment, on_delete=models.CASCADE, blank=True, default=9)
    title = models.CharField(max_length=100)
    points = models.IntegerField(default=0)
    content = models.TextField(default="-")

    def __str__(self):
        return self.title
