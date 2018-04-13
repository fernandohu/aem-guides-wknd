/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
*
**************************************************************************/

typedef NS_OPTIONS(NSInteger, STETouchAction) {
    STETouchActionTouchNone = 1 << 0,
    STETouchActionTouchMove = 1 << 1,
    STETouchActionTouchUp = 1 << 2,
    STETouchActionTouchDown = 1 << 3,
    STETouchActionHoverStart = 1 << 4, // Special actions for showing touch points
    // from within simulator, ignored as part of
    // "any"
            STETouchActionHoverMove = 1 << 5,
    STETouchActionHoverStop = 1 << 6,
    STETouchActionAny = STETouchActionTouchNone |
            STETouchActionTouchMove |
            STETouchActionTouchDown |
            STETouchActionTouchUp
};
