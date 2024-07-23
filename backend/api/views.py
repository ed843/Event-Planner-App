from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, EventSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event
from django.db.models import Q
from rest_framework.filters import SearchFilter
from rest_framework import filters
from rest_framework.response import Response
from .models import UserProfile

class EventListCreate(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(created_by=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)
    
class PublicEventListCreate(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'location', 'category']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        queryset = Event.objects.filter(isPublic=True)
        
        # Custom filtering
        name = self.request.query_params.get('name', None)
        description = self.request.query_params.get('description', None)
        location = self.request.query_params.get('location', None)
        category = self.request.query_params.get('category', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)

        if name:
            queryset = queryset.filter(name__icontains=name)
        if description:
            queryset = queryset.filter(description__icontains=description)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        return queryset




class EventDelete(generics.DestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(created_by=user)




class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


class PublicEventListCreate(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'location', 'category']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        queryset = Event.objects.filter(isPublic=True)
        
        # Custom filtering
        name = self.request.query_params.get('name', None)
        description = self.request.query_params.get('description', None)
        location = self.request.query_params.get('location', None)
        category = self.request.query_params.get('category', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)

        if name:
            queryset = queryset.filter(name__icontains=name)
        if description:
            queryset = queryset.filter(description__icontains=description)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        return queryset

class FollowingEventListCreate(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'location', 'category']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        user = self.request.user
        following_users = user.profile.following.all()
        queryset = Event.objects.filter(created_by__in=following_users, isPublic=True)
        
        # Custom filtering (same as in PublicEventListCreate)
        name = self.request.query_params.get('name', None)
        description = self.request.query_params.get('description', None)
        location = self.request.query_params.get('location', None)
        category = self.request.query_params.get('category', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)

        if name:
            queryset = queryset.filter(name__icontains=name)
        if description:
            queryset = queryset.filter(description__icontains=description)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        return queryset

class FollowUser(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            user_to_follow = User.objects.get(pk=pk)
            user_profile, created = UserProfile.objects.get_or_create(user=request.user)
            user_profile.following.add(user_to_follow)
            return Response({"status": "success"})
        except User.DoesNotExist:
            return Response({"status": "error", "message": "User not found"}, status=404)

class UnfollowUser(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            user_to_unfollow = User.objects.get(pk=pk)
            user_profile, created = UserProfile.objects.get_or_create(user=request.user)
            user_profile.following.remove(user_to_unfollow)
            return Response({"status": "success"})
        except User.DoesNotExist:
            return Response({"status": "error", "message": "User not found"}, status=404)
        
class FollowedUsersList(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.profile.following.all()