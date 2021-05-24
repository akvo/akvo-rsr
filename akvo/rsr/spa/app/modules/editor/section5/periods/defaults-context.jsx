import React, { useReducer, useEffect, createContext, useContext } from 'react';
import { differenceWith, intersectionWith, isEqual } from 'lodash';
import api from '../../../../utils/api';

const diffPeriods = (first, second) => {
    return differenceWith(first, second, isEqual);
};
const intersectPeriods = (first, second) => {
    return intersectionWith(first, second, isEqual);
};

const symmetricDifferencePeriods = (first, second) => {
    return [].concat(diffPeriods(first, second), diffPeriods(second, first));
};

export const DefaultPeriodsStateContext = createContext();
export const DefaultPeriodsCommandsContext = createContext();

export const defaultPeriodsReducer = (state, action) => {
    switch (action.type) {
        case 'INIT':
            return { items: [...action.items], added: [], removed: [] };
        case 'RESET_ADDED':
            return { ...state, added: [] };
        case 'RESET_REMOVED':
            return { ...state, removed: [] };
        case 'MODIFY':
            const addedDiff = diffPeriods(action.items, state.items);
            const removedDiff = diffPeriods(state.items, action.items);
            const added = [...state.added, ...addedDiff];
            const removed = [...state.removed, ...removedDiff];
            const intersect = intersectPeriods(added, removed);
            return {
                items: [...action.items],
                added: diffPeriods(added, intersect),
                removed: diffPeriods(removed, intersect),
            };
        default:
            return state;
    }
};

export const DefaultPeriodsProvider = ({ children, projectId }) => {
    const [state, dispatch] = useReducer(defaultPeriodsReducer, {
        items: [],
        added: [],
        removed: [],
    });
    const commands = {
      updateItems: async (periods) => {
        const hasModifications = symmetricDifferencePeriods(periods, state.items).length > 0;
        if (!hasModifications) {
          return;
        }
        await api.post(`/project/${projectId}/default_periods/`, { periods });
        dispatch({ type: 'MODIFY', items: periods });
      },
      applyAdded: () => {
        console.log('applyAdded')
        // TODO: implement
        dispatch({type: 'RESET_ADDED'})
      },
      resetAdded: () => dispatch({type: 'RESET_ADDED'}),
      applyRemoved: () => {
        console.log('applyRemoved')
        // TODO: implement
        dispatch({type: 'RESET_REMOVED'})
      },
      resetRemoved: () => dispatch({type: 'RESET_REMOVED'}),
    }

    useEffect(() => {
        const initializeDefaultPeriods = async () => {
            const {
                data: { periods },
            } = await api.get(`/project/${projectId}/default_periods/`);
            dispatch({ type: 'INIT', items: periods });
        };
        initializeDefaultPeriods();
    }, []);

    return (
        <DefaultPeriodsStateContext.Provider value={state}>
            <DefaultPeriodsCommandsContext.Provider value={commands}>
                {children}
            </DefaultPeriodsCommandsContext.Provider>
        </DefaultPeriodsStateContext.Provider>
    );
};

export const useDefaultPeriodsState = () => {
    const state = useContext(DefaultPeriodsStateContext);
    if (typeof state === 'undefined') {
        throw new Error('useDefaultPeriodsState must be used within a DefaultPeriodsProvider');
    }
    return state;
};

export const useDefaultPeriodsCommands = () => {
    const update = useContext(DefaultPeriodsCommandsContext);
    if (typeof update === 'undefined') {
        throw new Error('useDefaultPeriodsCommands must be used within a DefaultPeriodsProvider');
    }
    return update;
};
