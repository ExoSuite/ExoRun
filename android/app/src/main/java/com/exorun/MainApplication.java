package com.exorun;

import android.app.Application;

import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.rnfs.RNFSPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.oblador.keychain.KeychainPackage;
import com.viromedia.bridge.ReactViroPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.zmxv.RNSound.RNSoundPackage;

import cx.evermeet.versioninfo.RNVersionInfoPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import javax.annotation.Nonnull;

class DummyPackage implements ReactPackage {

    @Nonnull
    @Override
    public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        return modules;
    }

    @Nonnull
    @Override
    public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> additionalPackages = Collections.emptyList();

            if (!com.exorun.Application.IsRunningOnEmulator()) {
                additionalPackages.add(new ReactViroPackage(ReactViroPackage.ViroPlatform.AR));
            }

            return Arrays.asList(
                    new MainReactPackage(),
                    new RNDeviceInfo(true),
                    new RCTMGLPackage(),
                    new RNFSPackage(),
                    new RNScreensPackage(),
                    new AsyncStoragePackage(),
                    new RNLocalizePackage(),
                    new RNSoundPackage(),
                    new LottiePackage(),
                    new ReactNativeConfigPackage(),
                    new VectorIconsPackage(),
                    new SplashScreenReactPackage(),
                    new KeychainPackage(),
                    new RNGestureHandlerPackage(),
                    new RNVersionInfoPackage(),
                    additionalPackages.stream().findFirst().orElse(new DummyPackage())
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
