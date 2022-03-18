from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from drf_yasg.utils import swagger_auto_schema
from requests import Response
from rest_framework.decorators import api_view
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


@swagger_auto_schema(
    methods=['get'],
    operation_summary='Get dashboard data.'
)
@api_view(['GET'])
def get_dashboard_data(request):
    """Get dashboard data."""

    members = list(Member.objects.all().values())
    members_info = get_members_info()
    result = [
        {
            'members': members,
            'members_info': members_info
        }
    ]

    return JsonResponse(result, safe=False)
