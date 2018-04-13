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

#import "Sistine/STETouch.h"
#import "Sistine/STETouchService.h"
#import "SistineTouch.h"

#define JS_SISTINE_BRIDGE @"SistineBridge"

@implementation SistineTouch {
    STETouchService *touchService;
}

- (void)pluginInitialize {
    CDVViewController *vc = self.viewController;
    NSMutableDictionary *settings = vc.settings;
    NSString *configFile = settings[@"sistine.overlay-config"];
    if (!configFile) {
        configFile = @"sistine-config.json";
    }
    NSString *path = [[NSBundle mainBundle] pathForResource:configFile ofType:nil];
    NSDictionary *config = nil;
    if (path) {
        NSString *jsonString = [[NSString alloc] initWithContentsOfFile:path encoding:NSUTF8StringEncoding error:NULL];
        NSError *jsonError;
        config = [NSJSONSerialization JSONObjectWithData:[jsonString dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers error:&jsonError];
        if (jsonError) {
            NSLog(@"Error while loading json %@: %@", path, jsonError);
        }
    }
    if (config) {
        touchService = [[STETouchService alloc] initWithOverlayConfig:config];
    } else {
        touchService = [[STETouchService alloc] init];
    }

    // init touch notifications
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(receiveTouch:) name:kSTETouchNotificationName object:nil];

    // init application state notifications
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onResume) name:NSApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onPause) name:NSApplicationDidResignActiveNotification object:nil];

    NSLog(@"SistineTouch initialized.");
}

- (void)onPause {
    [touchService stop];
}

- (void)onResume {
    [touchService start];
}

- (void)onAppTerminate {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:kSTETouchNotificationName object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:NSApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:NSApplicationDidResignActiveNotification object:nil];
    [super onAppTerminate];
}

- (void)receiveTouch:(NSNotification *)notification {
    STETouch *touch = (STETouch *) notification.object;

    // map coordinates to window
    NSRect frame = self.webView.window.frame;
    CGFloat x = touch.location.x - frame.origin.x;
    CGFloat y = frame.origin.y + self.webView.frame.size.height - touch.location.y;

    @try {
        WebScriptObject *sistineBridge = [self.webView.windowScriptObject valueForKey:JS_SISTINE_BRIDGE];
        [sistineBridge callWebScriptMethod:@"handleTouch" withArguments:@[@(touch.action), @(touch.identity), @(x), @(y)]];
    }
    @catch (NSException * e) {
        NSLog(@"Error while accessing window[\"%@\"]: %@", JS_SISTINE_BRIDGE, e);
    }
}

@end
