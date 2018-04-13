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
          import="com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
                com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap,
                com.day.cq.commons.inherit.InheritanceValueMap,
                org.apache.sling.api.resource.Resource" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    String relativeResourcePath = FrameworkContentExporterUtils.getRelativePathToDescendantResource(
            currentPage.adaptTo(Resource.class), resource);

    String controllerNameStripped = resource.getPath().replaceAll("[^A-Za-z0-9]", "");
    InheritanceValueMap inheritedProperties = new HierarchyNodeInheritanceValueMap(resourcePage.getContentResource());
    String tabViewName = "tab-" + inheritedProperties.getInherited("ui-router-tabViewName", controllerNameStripped);

    // Remove "/content" prefix from the beginning of each page path
    String uiRouterURL = resourcePage.getPath().substring("/content".length());

    slingResponse.setContentType("application/javascript");
%>
                .state('tab.<%= xssAPI.encodeForJSString(controllerNameStripped) %>', {
                    url: '<%= xssAPI.encodeForJSString(uiRouterURL) %>',
                    views: {
                       '<%= xssAPI.encodeForJSString(tabViewName) %>': {
                            templateUrl: '<%= xssAPI.encodeForJSString(relativeResourcePath) %>.template.html' + cacheKiller,
                            controller: 'MorePageCtrl'
                        }
                    },
                    resolve: {
                        auth : function($q, AuthService) {
                            var deferred = $q.defer();

                            var successHandler = function() {
                                AuthService.getAuth().getToken(function(error, token) {
                                    deferred.resolve({
                                        isLoggedIn : (token) ? true : false,
                                    });
                                }, function() {
                                    deferred.resolve({
                                        isLoggedIn : false
                                    });
                                });
                            };

                            var failureHandler = function() {
                                deferred.resolve({
                                    isLoggedIn : false
                                });
                            };

                            // using login(true) allows us to see if we're logged in
                            AuthService.login(true).then(successHandler, failureHandler);

                            return deferred.promise;
                        },
                        profile: function(auth, $q, ProfileService) {
                            var deferred = $q.defer();

                            if (auth.isLoggedIn) {
                                ProfileService.loadProfile().then(function(data) {
                                    deferred.resolve(data);
                                }, function() {
                                    deferred.resolve();
                                });
                            } else {
                                deferred.resolve();
                            }
                            return deferred.promise;
                        }
                    }
                })
