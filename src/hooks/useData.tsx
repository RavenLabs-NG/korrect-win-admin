import { Component, createContext, useContext } from "react";
import { AppData } from "../types";

interface Props<T extends object> {
    init: T;
    children: React.ReactNode;
    storageListener?: boolean;
}

export interface ConnectProps<P> {
    data: P;
    dispatch: (d: Partial<P> | "clear") => void;
}

const AppContext = createContext({ data: {}, dispatch: (_: any) => { } });

export class DataProvider<T extends object> extends Component<
    Props<T>,
    T & { isMounted: boolean }
> {
    init = this.props.init;

    constructor(props: any) {
        super(props);
        const { init } = this.props;

        this.init = init;
        this.state = { ...init, isMounted: false };
        this.dispatch = this.dispatch.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        const { storageListener = false } = this.props;
        this.setState({ ...this.getItem(), isMounted: true });
        if (storageListener) {
            window.addEventListener("storage", () => {
                this.setState(this.getItem());
            });
        }
    }

    componentWillUnmount() {
        const { storageListener = false } = this.props;
        if (storageListener) {
            window.removeEventListener("storage", () => {
                this.setState(this.getItem());
            });
        }
    }

    getItem() {
        try {
            const data = localStorage.getItem("korrecto");
            if (data) return JSON.parse(data);
            this.persist(this.init);
            return this.init;
        } catch (e) {
            return this.init;
        }
    }

    persist = (payload: T) => {
        try {
            if (localStorage) {
                localStorage.setItem("korrecto", JSON.stringify(payload));
            }
        } catch (e) {
            return;
        }
    };

    updateState(data: Partial<T>) {
        this.setState((p) => ({ ...p, ...data }));
        this.persist({ ...this.state, ...data });
    }

    dispatch(payload: Partial<T> | "clear") {
        if (payload === "clear") {
            this.updateState(this.init);
        } else {
            this.updateState(payload);
        }
    }

    render() {
        const { isMounted } = this.state;
        const { children } = this.props;
        return (
            <AppContext.Provider
                value={{ data: this.state, dispatch: this.dispatch }}
            >
                {isMounted && children}
            </AppContext.Provider>
        );
    }
}

export default function useData<T extends object = AppData>() {
    const { data, dispatch } = useContext(AppContext);

    return {
        data: data as T,
        dispatch: (_: Partial<T> | "clear") => dispatch(_),
    };
}

export function connectData<T extends object>(Comp: any) {
    const ConnectData = (props: object) => {
        const { data, dispatch } = useData<T>();

        return (
            <>
                {
                    // @ts-ignore
                    <Comp {...props} data={data} dispatch={dispatch} />
                }
            </>
        );
    };

    return ConnectData;
}
