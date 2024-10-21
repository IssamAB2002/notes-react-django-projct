from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

# define User model serializer 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # define model
        model = User
        # define fields
        fields = ['id', 'username', 'password']
        # set passwrod to be write only ( to not be showed in get requests )
        extra_kwargs = {'password': {'write_only': True}}
    # define create user function ( craete user based on serialized data )
    def create(self, validated_data):
        print(validated_data)
        # create user
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}