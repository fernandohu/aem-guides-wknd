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
%><%@page session="false"
          import="java.util.List,
                  com.day.cq.wcm.api.components.IncludeOptions,
                  com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils" %><%
%><%@include file="/libs/foundation/global.jsp" %><%

    // Find all angular components
    Page angularPage = resource.adaptTo(Page.class);
    slingRequest.setAttribute("angularPage", angularPage);

    List<Resource> angularPageComponents = FrameworkContentExporterUtils.getAllAngularPageComponents(angularPage.getContentResource());

    String relativeResourcePath = FrameworkContentExporterUtils.getRelativePathToDescendantResource(
            currentPage.adaptTo(Resource.class), angularPage.adaptTo(Resource.class));
    pageContext.setAttribute("relativeResourcePath", relativeResourcePath);
    
    slingResponse.setContentType("application/javascript");

%><c:set var="controllerNameStripped"><%= angularPage.getPath().replaceAll("[^A-Za-z0-9]", "") %></c:set>

// Controller for page '<c:out value="${angularPage.name}"/>'
.controller('<c:out value="${controllerNameStripped}"/>', ['$scope', '$http', '$stateParams',
function($scope, $http, $stateParams) {
    var skuPrefix = $stateParams.skuPrefix;
    var name = $stateParams.name;
    var productPath = '/' + skuPrefix + '/' + name;

    var data = $http.get('<c:out value="${relativeResourcePath}"/>' + productPath + '.angular.json' + cacheKiller);

    // ng-library-item component controller 
    data.then(function(response) {
        $scope.product = response.data["content-par/product-item"].items[0];
    });
<%

    for (Resource angularComponent : angularPageComponents) {
        IncludeOptions opts = IncludeOptions.getOptions(request, true);
        opts.setDecorationTagName("");
        opts.forceSameContext(Boolean.TRUE);
        %><cq:include resourceType="<%= angularComponent.getResourceType() %>" path="<%= angularComponent.getPath() + ".controller.js" %>"/><%
    }
%>
}])