// for testing components
import { For, ParentComponent } from 'solid-js';

import { TestButton } from '@cubeartisan/cubeartisan/components/Button/Button.testrender';
import { Center } from '@cubeartisan/cubeartisan/components/Center';
import { TestModal } from '@cubeartisan/cubeartisan/components/Modal/Modal.testrender';
import { TestRadioGroup } from '@cubeartisan/cubeartisan/components/RadioGroup/RadioGroup.testrender';
import { VStack } from '@cubeartisan/cubeartisan/components/Stack';
import { TestSwitch } from '@cubeartisan/cubeartisan/components/Switch/Switch.testrender';

const TestComponentBox: ParentComponent = (props) => (
  <Center
    atoms={{ minWidth: 'lg', minHeight: 'md', borderRadius: '2xl', backgroundColor: 'neutralSubtleSecondary' }}
    children={props.children}
  />
);

const renderList = [<TestModal />, <TestRadioGroup />, <TestSwitch />, <TestButton />];

const Test = () => (
  <VStack
    style={{ 'min-height': 'calc(100vh - 4rem)' }}
    atoms={{ gap: 10, padding: 16 }}
    recipe={{ align: 'center', justify: 'center' }}
  >
    <For each={renderList}>{(testComponent) => <TestComponentBox children={testComponent} />}</For>
  </VStack>
);

export default Test;
