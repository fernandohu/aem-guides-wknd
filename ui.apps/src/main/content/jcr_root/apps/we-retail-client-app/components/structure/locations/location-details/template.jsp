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
%><%@page session="false" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><%@page import="com.day.cq.i18n.I18n,
                 com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%

    I18n i18n = new I18n(slingRequest);

    String componentPath = resource.getPath();
    request.setAttribute("componentDataPath", FrameworkContentExporterUtils.getJsFriendlyResourceName(componentPath));

%><div class="location-details" ng-cloak ng-controller="LocationDetailsCtrl" ng-init="init('<c:out value="${componentDataPath}"/>')">

    <div class="location-header">
        <div class="location-header-content padding">
            <h2>{{location.name}}</h2>
            <h4>{{location.coordinates | coordinates}}</h4>
        </div>
    </div>
    <ul class="list my-store" ng-class="{'active' : myStore}">
        <li class="item item-icon-left item-toggle">
            <i class="icon ion-location"></i>
            <span ng-hide="myStore"><%=i18n.get("Make this My Store")%></span>
            <span ng-show="myStore"><%=i18n.get("My Store")%></span>
            <label class="toggle toggle-balanced">
                <input type="checkbox" ng-model="myStore" ng-change="saveStore(myStore)">
                <div class="track">
                    <div class="handle"></div>
                </div>
            </label>
        </li>
    </ul>
    <div class="location-content padding">
        <h3>Where to find us</h3>
        <div class="location-container">
            <div class="list">
                <a class="item item-icon-left" href="#" ng-click="map($event)">
                    <i class="icon ion-location"></i>
                    {{location.address}}
                </a>
                <a class="item item-icon-left" ng-click="directions($event)">
                    <i class="icon ion-map"></i>
                    <%=i18n.get("Directions")%>
                </a>
                <a class="item item-icon-left" ng-click="phone($event)">
                    <i class="icon ion-ios-telephone"></i>
                    {{location.phone | phonenumber}}
                </a>
            </div>
        </div>
        <h3><%=i18n.get("Standard Hours")%></h3>
        <div class="location-container">
            <div class="location-hours" ng-repeat="hour in location.formattedHours">
                <span><p>{{hour.day}}</p></span>
                <span><p>{{hour.time}}</p></span>
            </div>
        </div>
        <h3><%=i18n.get("Store Services")%></h3>
        <div class="location-container">
            <p>{{location.description}}</p>
        </div>
    </div>

</div>