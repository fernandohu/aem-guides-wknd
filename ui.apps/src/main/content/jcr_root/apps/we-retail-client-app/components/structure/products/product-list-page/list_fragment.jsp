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
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" %>

    <a class="item item item-icon-right " ng-click="go('<%= xssAPI.getValidHref(resourcePage.getPath()) %>', '<%= xssAPI.encodeForHTMLAttr(resourcePage.getTitle()) %>', null, $event)">

        <% if (null != resourcePage.getTitle()) {%>
            <div >
                <%= xssAPI.encodeForHTML(resourcePage.getTitle()) %>
            </div>
            <i class="icon ion-chevron-right" style="color: darkgray;" ></i>
        <%}%>
    </a>
