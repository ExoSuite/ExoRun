package com.exorun;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.keychain.KeychainPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.oblador.keychain.KeychainPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.oblador.keychain.KeychainPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.oblador.keychain.KeychainPackage;
import com.oblador.keychain.KeychainPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;


import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.oblador.keychain.KeychainPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new MainReactPackage(),
            new RNLocalizePackage(),
            new RNSoundPackage(),
            new LottiePackage(),
                    new ReactNativeConfigPackage(),
                    new RNLanguagesPackage(),
                    new VectorIconsPackage(),
                    new SplashScreenReactPackage(),
                    new KeychainPackage(),
                    new RNGestureHandlerPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
