<%--
    Copyright 2016 Adobe Systems Incorporated

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
--%><%
%><%@page session="false" contentType="text/html; charset=utf-8"%><%
%><%@ page import="com.day.cq.i18n.I18n" %><%
%><%@include file="/libs/foundation/global.jsp"%><%
    I18n i18n = new I18n(slingRequest);
    final String detailsPath = properties.get("./details", currentPage.getPath() + "/details");
%><div class="list card" ng-show="myStoreList.length">
    <a class="item item-icon-right" ng-repeat="location in locations | myStore as myStoreList" ng-controller="LocationItemCtrl" x-cq-linkchecker="skip" ng-click="details('<%= xssAPI.getValidHref(detailsPath) %>')">
        <div>
            <h3 class="my-store"><i class="ion-location"></i><span><%=i18n.get("My Store")%></span></h3>
            <h2>{{location.name}}</h2>
            <p>{{location.address}}</p>
        </div>
        <div class="footnote">
            <p class="left "><b><span class="open" ng-class="{'closed': open==0, 'closing': open==2}">{{open | open}}</span></b></p>
            <p class="right ">{{location.distance | distance}}</p>
        </div>
        <i class="icon ion-chevron-right"></i>
    </a>
</div>
<div class="list">
    <a class="item item-icon-right" ng-repeat="location in locations | filter:query as filteredLocations" ng-controller="LocationItemCtrl" x-cq-linkchecker="skip" ng-click="details('<%= xssAPI.getValidHref(detailsPath) %>')">
        <div>
            <h2>{{location.name}}</h2>
            <p>{{location.address}}</p>
        </div>
        <div class="footnote">
            <p class="left "><b>{{location.hours | today}}</b></p>
            <p class="right ">{{location.distance | distance}}</p>
        </div>
        <i class="icon ion-chevron-right"></i>
    </a>
</div>
