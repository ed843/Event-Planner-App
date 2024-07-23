from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Event
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'following']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user
    
class EventSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ["id", "name", "description", "date", "location", "category", "created_by", "created_at", "updated_at", "isPublic"]
        extra_kwargs = {"created_by": {"read_only": True}}

    def get_created_by(self, obj):
        return {
            'id': obj.created_by.id,
            'username': obj.created_by.username
        }

        