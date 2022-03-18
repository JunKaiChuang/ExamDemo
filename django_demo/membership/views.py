from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from requests import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework import viewsets
from membership.models import Member
from membership.serializers import MemberSerializer

from membership.models import get_members_info

from django.core import serializers


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


def get_dashboard_data(request):
    members = list(Member.objects.all().values())
    members_info = get_members_info()
    result = [
        {
            'members': members,
            'members_info': members_info
        }
    ]

    return JsonResponse(result, safe=False)
