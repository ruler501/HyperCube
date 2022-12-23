import { mergeProps, splitProps } from 'solid-js';

import artisan from '@cubeartisan/cubeartisan/components/factory';
import { stackRecipe, StackVariants } from '@cubeartisan/cubeartisan/components/Stack/Stack.css';
import type { ArtisanComponent } from '@cubeartisan/cubeartisan/components/types';

export const Stack: ArtisanComponent<'div', StackVariants> = (props) => {
  const propsWithDefault = mergeProps({ space: 'md', align: 'center' }, props);
  const [local, others] = splitProps(propsWithDefault, ['recipe']);

  return <artisan.div class={stackRecipe(local.recipe)} {...others} />;
};
