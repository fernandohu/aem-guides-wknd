/*
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2015 Adobe Systems Incorporated
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
 */

#import "PlayerPreferences.h"

@interface PreferencesController: NSWindowController
@end

@implementation PreferencesController
@end

@implementation PlayerPreferences {

    PreferencesController* _pController;
}

- (void) pluginInitialize {
    [super pluginInitialize];

    // we simply adjust the target for the preferences menu item
    NSMenu* appMenu = self.viewController.window.menu;
    NSMenu* mainMenu = [appMenu itemAtIndex:0].submenu;

    bool found = false;
    for (NSMenuItem* item in mainMenu.itemArray) {
        if (item.action == @selector(onPreferences:)) {
            item.target = self;
            found = true;
            break;
        }
    }

    if (!found) {
        NSLog(@"PlayerPreferences: didn't find menu item to capture. disabling.");
    } else {
        NSLog(@"PlayerPreferences initialized");
    }
}

- (IBAction) onPreferences:(id) sender {
    NSLog(@"onPreferences...");

    if (!_pController) {
        _pController = [[PreferencesController alloc] initWithWindowNibName:@"PlayerPreferences"];
    }
    [_pController showWindow:self];
    [_pController.window makeKeyAndOrderFront:self];
}

@end
