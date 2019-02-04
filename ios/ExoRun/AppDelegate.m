/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import "RNSplashScreen.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ReactNativeConfig/ReactNativeConfig.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    NSURL *jsCodeLocation;

#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

    NSString *serverIP = [ReactNativeConfig envFor:@"SERVER_IP"];

    if ([serverIP length] != 0) {
        NSString *jsCodeUrlString = [NSString stringWithFormat:@"http://%@:8081/index.bundle?platform=ios&dev=true", serverIP];
        NSString *jsBundleUrlString = [jsCodeUrlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        jsCodeLocation = [NSURL URLWithString:jsBundleUrlString];
    }

    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"ExoRun"
                                                 initialProperties:nil
                                                     launchOptions:launchOptions];
    rootView.backgroundColor = [UIColor blackColor];

    NSArray *allPngImageNames = [[NSBundle mainBundle] pathsForResourcesOfType:@"png" inDirectory:nil];
    for (NSString *imgName in allPngImageNames) {
        if ([imgName containsString:@"LaunchImage"]) {
            UIImage *img = [UIImage imageNamed:imgName];

            if (img.scale == [UIScreen mainScreen].scale && CGSizeEqualToSize(img.size, [UIScreen mainScreen].bounds.size)) {
                rootView.backgroundColor = [UIColor colorWithPatternImage:img];
            }
        }
    }


    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];

    [RNSplashScreen show];

    return YES;
}

@end
