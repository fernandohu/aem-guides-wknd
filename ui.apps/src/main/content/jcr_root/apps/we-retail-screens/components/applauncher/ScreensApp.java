/*
 * Copyright 2016 Adobe Systems Incorporated
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package apps.we_retail_screens.components.applauncher;

import java.io.StringWriter;
import java.util.Iterator;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.io.JSONWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.commerce.api.CommerceException;
import com.adobe.cq.commerce.api.Product;
import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.commons.ImageResource;
import com.day.cq.wcm.api.Page;

public class ScreensApp extends WCMUsePojo {

    /**
     * default logger
     */
    private static final Logger log = LoggerFactory.getLogger(ScreensApp.class);

    @Override
    public void activate() throws Exception {
    }

    public String getAppPath() {
        return getResourcePage().getPath();
    }

    public String getDevicePath() {
        return getCurrentPage().getPath();
    }

    public String getDisplayPath() {
        return getCurrentPage().getParent().getPath();
    }
}
