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

#import "PlayerStorage.h"

@implementation PlayerStorage {

}

@synthesize storageRoot;

#pragma mark CDVPlugin interface

- (void) pluginInitialize {
    // ~/Library/Application Support/<bundle-id>/files
    self.storageRoot = [PlayerStorage getSupportDirectoryFor:NSApplicationSupportDirectory pathComponents:@[@"files"]];

    NSLog(@"PlayerStorage plugin initialized.");
}

- (void) onPause {
}

- (void) onResume {
}

#pragma mark private functions

+ (NSURL*) getSupportDirectoryFor:(NSSearchPathDirectory) directory pathComponents:(NSArray*) components {
    NSError* error;
    NSFileManager* fm = [NSFileManager defaultManager];
    NSURL* supportDir = [fm URLForDirectory:directory inDomain:NSUserDomainMask appropriateForURL:nil create:YES error:&error];
    if (supportDir == nil) {
        NSLog(@"unable to get support directory: %@", error);
        return nil;
    }

    NSString* bundleID = [[NSBundle mainBundle] bundleIdentifier];
    NSURL* dirPath = [supportDir URLByAppendingPathComponent:bundleID];
    for (NSString* pathComponent in components) {
        dirPath = [dirPath URLByAppendingPathComponent:pathComponent];
    }

    if (![fm fileExistsAtPath:dirPath.path]) {
        if (![fm createDirectoryAtURL:dirPath withIntermediateDirectories:YES attributes:nil error:&error]) {
            NSLog(@"unable to create support directory: %@", error);
            return nil;
        }
    }
    return dirPath;
}

#pragma mark PlayerStorage API

- (void) getUsage:(CDVInvokedUrlCommand*) command {
    NSError* error = nil;

    // get volume name
    NSString *volumeName;
    [self.storageRoot getResourceValue:&volumeName forKey:NSURLVolumeNameKey error:&error];

    // get sizes
    error = nil;
    NSDictionary* pDict = [[NSFileManager defaultManager] attributesOfFileSystemForPath:self.storageRoot.path error:&error];

    NSMutableDictionary* result = [NSMutableDictionary dictionary];
    result[@"volume"] = volumeName;
    result[@"path"] = self.storageRoot.path;
    result[@"total"] = (NSNumber*) pDict[NSFileSystemSize];
    result[@"free"] = (NSNumber*) pDict[NSFileSystemFreeSize];

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
