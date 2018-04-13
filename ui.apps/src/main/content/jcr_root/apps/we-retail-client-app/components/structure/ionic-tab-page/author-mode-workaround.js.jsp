<%--
  ADOBE CONFIDENTIAL
  __________________

   Copyright 2017 Adobe Systems Incorporated
   All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@page session="false" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
    slingResponse.setContentType("application/javascript");
%>
                // Return to the app's previous state: both tab and page
                var tabState = CQ.mobile.author.getUrlParameter("tabState");
                var pageState = CQ.mobile.author.getUrlParameter("pageState");

                // Navigate first to the tab, once the initial view has loaded
                if (tabState != null) {
                    var afterInitialViewDeregister = $scope.$on("$ionicView.afterEnter", function() {
                        afterInitialViewDeregister();
                        if (pageState != null) {
                            var afterTabViewDeregister = $scope.$on("$ionicView.afterEnter", function() {
                                afterTabViewDeregister();
                                try {
                                    $state.go(pageState);
                                } catch(error) {
                                    console.log('[author-mode-workaround] Failed to navigate back to: ' + pageState);
                                }
                            });
                        }
                        $state.go(tabState);
                    });
                }