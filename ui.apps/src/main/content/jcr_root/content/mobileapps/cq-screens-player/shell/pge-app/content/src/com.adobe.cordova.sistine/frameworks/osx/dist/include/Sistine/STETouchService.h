/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2014 Adobe Systems Incorporated
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

#import <Foundation/Foundation.h>

static NSString* const kSTETouchNotificationName = @"sistineTouch";
static NSString* const kSTEConnectedNotificationName = @"sistineTouchProviderConnected";
static NSString* const kSTEDisconnectedNotificationName = @"sistineTouchProviderDisconnected";

@class STETouch;

@class STEPQLabsOverlayGrid;
@class STEHIDService;
@class STEMouseTouchSimulator;

@interface STETouchService : NSObject

- (id)initWithOverlayConfig:(NSDictionary *)config;

@property(nonatomic, readonly) STEPQLabsOverlayGrid* overlayGrid;
@property(nonatomic, readonly) STEHIDService* hidService;
@property(nonatomic, readonly) STEMouseTouchSimulator* mouseSimulator;
@property(nonatomic, readonly) BOOL isRunning;

- (void) start;

- (void) stop;

@end
