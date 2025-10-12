import { configureStore } from '@reduxjs/toolkit';
import resumeSlice from './slices/resumeSlice';

// Enhanced console styling for better development experience
const consoleStyles = {
    info: 'color: #3b82f6; font-weight: bold; background: linear-gradient(90deg, #dbeafe, #eff6ff); padding: 4px 8px; border-radius: 4px;',
    success: 'color: #10b981; font-weight: bold; background: linear-gradient(90deg, #d1fae5, #ecfdf5); padding: 4px 8px; border-radius: 4px;',
    warning: 'color: #f59e0b; font-weight: bold; background: linear-gradient(90deg, #fef3c7, #fffbeb); padding: 4px 8px; border-radius: 4px;',
    error: 'color: #ef4444; font-weight: bold; background: linear-gradient(90deg, #fecaca, #fef2f2); padding: 4px 8px; border-radius: 4px;',
};

const loadState = () => {
    console.log('%c🔄 Loading State from Local Storage...', consoleStyles.info);

    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) {
            console.log('%c⚠️ No previous state found in Local Storage', consoleStyles.warning);
            return undefined;
        }
        
        const parsedState = JSON.parse(serializedState);
        console.log('%c✅ State Loaded Successfully from Local Storage', consoleStyles.success);
        console.log('%c📊 Loaded Data:', consoleStyles.info, parsedState);
        
        return parsedState;
    } catch (err) {
        console.log('%c❌ Error Loading State from Local Storage', consoleStyles.error);
        console.error('%cError Details:', consoleStyles.error, err);
        return undefined;
    }
};

const store = configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: loadState(),
    reducer: {
        resume: resumeSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Enhanced serializable check configuration
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Enhanced debounce function with visual feedback
function debounce(func, timeout = 2500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

// Enhanced save state function with better logging
const saveState = debounce(() => {
    try {
        const state = store.getState();
        console.log('%c💾 Saving State to Local Storage...', consoleStyles.info);
        
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
        
        console.log('%c✅ State Saved Successfully to Local Storage', consoleStyles.success);
        console.log('%c📈 Saved Data Size:', consoleStyles.info, `${(serializedState.length / 1024).toFixed(2)} KB`);
        
        // Dispatch a custom action to update UI components about save status
        store.dispatch({ type: 'resume/setSaved', payload: true });
        
    } catch (err) {
        console.log('%c❌ Error Saving State to Local Storage', consoleStyles.error);
        console.error('%cError Details:', consoleStyles.error, err);
    }
}, 2500);

// Enhanced subscription with error handling
try {
    store.subscribe(saveState);
    console.log('%c🎯 Redux Store Initialized Successfully', consoleStyles.success);
    console.log('%c🔗 Auto-save subscription active', consoleStyles.info);
} catch (err) {
    console.log('%c❌ Error Initializing Redux Store Subscription', consoleStyles.error);
    console.error('%cError Details:', consoleStyles.error, err);
}

// Development helper - log store state changes in development
if (process.env.NODE_ENV === 'development') {
    let previousState = store.getState();
    
    store.subscribe(() => {
        const currentState = store.getState();
        if (currentState !== previousState) {
            console.log('%c🔄 Store State Changed', consoleStyles.info);
            console.log('%cPrevious:', 'color: #6b7280;', previousState);
            console.log('%cCurrent:', 'color: #374151;', currentState);
            previousState = currentState;
        }
    });
}

export default store;
