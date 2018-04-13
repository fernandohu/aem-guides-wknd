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
%><%@include file="/libs/foundation/global.jsp" %>
<ion-view view-title="">
    <ion-content scroll="false" ng-class="{'has-tabs-top': platform.isAndroid()}" class="product-page">
        <cq:include resourceType="we-retail-client-app/components/structure/products/product-item" path="product"/>
    </ion-content>
</ion-view>