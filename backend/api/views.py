from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, NoteSerializer
from .models import Note
# class to list and create notes 
class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        notes = Note.objects.filter(author=user)
        return notes
    def perform_create(self, serializer):
        if serializer.is_valid():
            print(self.request.user)
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
    
class NoteDeleteView(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
# class to delete notes  
# class view to create user with serialized data ( permission to any )
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]