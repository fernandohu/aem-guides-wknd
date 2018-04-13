//
//  STEGlobal.h
//  sistine-framework
//
//  Created by Tobias Bocanegra on 04/09/15.
//  Copyright (c) 2015 Adobe Systems Incorporated. All rights reserved.
//

#ifndef sistine_framework_STEGlobal_h
#define sistine_framework_STEGlobal_h

#if DEBUG_ASSERT_PRODUCTION_CODE
#define NSLogDebug(format, ...)
#else
#define NSLogDebug(format, ...) \
NSLog(@"<%s:%d> %s, " format, \
strrchr("/" __FILE__, '/') + 1, __LINE__, __PRETTY_FUNCTION__, ## __VA_ARGS__)
#endif // if DEBUG_ASSERT_PRODUCTION_CODE

#endif
