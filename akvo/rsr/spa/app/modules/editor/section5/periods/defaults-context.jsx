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
            return { items: [...action.items], added: [], removed: [], status: null };
        case 'RESET_ADDED':
            return { ...state, added: [], status: action?.payload };
        case 'RESET_REMOVED':
            return { ...state, removed: [], status: action?.payload };
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
                status: 'modify'
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
        status: null
    });
    const commands = {
      updateItems: async (periods) => {
        const hasModifications = symmetricDifferencePeriods(periods, state.items).length > 0;
        if (!hasModifications) {
          return;
        }
        await api.post(`/project/${projectId}/default_periods/`, { periods })
        dispatch({ type: 'MODIFY', items: periods })
      },
      applyAdded: async () => {
        await api.post(`/bulk-add-periods/${projectId}/`, { periods: state.added })
        dispatch({type: 'RESET_ADDED', payload: 'added' })
      },
      resetAdded: () => dispatch({type: 'RESET_ADDED', payload: null }),
      applyRemoved: async () => {
        await api.post(`/bulk-remove-periods/${projectId}/`, { periods: state.removed })
        dispatch({type: 'RESET_REMOVED', payload: 'removed' })
      },
      resetRemoved: () => dispatch({type: 'RESET_REMOVED', payload: null }),
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
