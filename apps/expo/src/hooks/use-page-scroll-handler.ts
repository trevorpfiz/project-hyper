import type { ReanimatedEvent } from "react-native-reanimated";
import { useEvent, useHandler } from "react-native-reanimated";

type GeneralHandler<
  Event extends object,
  Context extends Record<string, unknown>,
> = (event: ReanimatedEvent<Event>, context: Context) => void;

type GeneralHandlers<
  Event extends object,
  Context extends Record<string, unknown>,
> = Record<string, GeneralHandler<Event, Context> | undefined>;

function usePagerScrollHandler(
  handlers: GeneralHandlers<object, Record<string, unknown>>,
  dependencies?: any,
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
  const subscribeForEvents = ["onPageScroll"];

  return useEvent(
    (event) => {
      "worklet";
      const { onPageScroll } = handlers;

      if (onPageScroll && event.eventName.endsWith("onPageScroll")) {
        onPageScroll(event, context);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer,
  );
}

export default usePagerScrollHandler;
