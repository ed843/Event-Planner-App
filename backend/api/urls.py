from django.urls import path
from . import views

urlpatterns = [
    path("events/", views.EventListCreate.as_view(), name="event-list"),
    path("events/delete/<int:pk>/", views.EventDelete.as_view(), name="delete-event"),
    path("events/public/", views.PublicEventListCreate.as_view(), name="public-event-list"),
    path("events/following/", views.FollowingEventListCreate.as_view(), name="following-event-list"),
    path("users/following/", views.FollowedUsersList.as_view(), name="following-user-list"),
    path("users/follow/<int:pk>/", views.FollowUser.as_view(), name="follow-user"),
    path("users/unfollow/<int:pk>/", views.UnfollowUser.as_view(), name="unfollow-user"),
]