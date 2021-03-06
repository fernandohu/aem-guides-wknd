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

#import <Foundation/Foundation.h>
#import <Cocoa/Cocoa.h>

#import "STETouchAction.h"


@class STETouchHistory;
@class STETouchManager;

/**
* Represents a single touch instance at a single point in time. The
* class is typically generated by a touch provider and is immutable.
*/
@interface STETouch : NSObject <NSCopying>

/**
* The action (aka "phase") of the touch.
*/
@property(nonatomic, readonly) STETouchAction action;

/**
* The unique identifier of the touch. This is typically assigned by the
* hardware interface providing the touch.
*/
@property(nonatomic, readonly) NSUInteger identity;

/**
* The screen-based location of the touch, in reference to an origin at the
* standard lower-left corner of the screen.
*/
@property(nonatomic, readonly) NSPoint location;

/**
* The size of the touch point. This may or may not be provided by the hardware.
* For instance, a mouse-simulated touch will have 0 size.
*/
@property(nonatomic, readonly) NSSize size;

/**
* The time at which the touch was created.
*/
@property(nonatomic, readonly) NSTimeInterval timeStamp;

/**
* The view in which the touch originated - that is, the view in which the
* touch first touched down. For touch move and touch up actions, this may be
* different than the view that the touch is actually over.
*/
@property(nonatomic, readonly) NSView* view;

/**
* The window in which the touch originated. Like the view, this is the window
* in which the touch first touched down.
*/
@property(nonatomic, readonly, weak) NSWindow* window;

/**
* The instance of the touch manager that provided this touch.
*/
@property(nonatomic, readonly, weak) STETouchManager* manager;

/**
* A convenience property for retrieving the history of this touch. The history
* can also be retrieved by querying the touch manager directly.
*/
@property(nonatomic, readonly) STETouchHistory* history;

/**
* Use this property to store arbitrary extra information that you may wish to
* associate with this touch.
*/
@property(nonatomic, strong) NSDictionary* userInfo;

/**
* Default initializer.
*/
- (id) initWithAction:(STETouchAction) action
             identity:(NSUInteger) identity
             location:(NSPoint) location
                 size:(NSSize) size
            timeStamp:(NSTimeInterval) timeStamp
                 view:(NSView*) view
               window:(__weak NSWindow*) window
              manager:(STETouchManager*) manager;

- (NSSize) deltaFromPoint:(NSPoint) point;

- (NSSize) deltaFromTouch:(STETouch*) touch;

- (CGFloat) distanceFromPoint:(NSPoint) point;

- (CGFloat) distanceFromTouch:(STETouch*) touch;

- (CGFloat) squaredDistanceFromPoint:(NSPoint) point;

- (CGFloat) squaredDistanceFromTouch:(STETouch*) touch;

- (NSString*) serializedAsString;

+ (STETouch*) deserializeFromString:(NSString*) string
                 includingTimeStamp:(BOOL) includeTimeStamp
                  originalTimeStamp:(NSTimeInterval*) originalTimeStamp;

@end
