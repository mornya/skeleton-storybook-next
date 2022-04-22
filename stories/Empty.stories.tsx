import React from 'react';
import Link from 'next/link';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const Empty = () => {
  return (
    <article>
      <section>
        <h2>Empty story for temporary</h2>
        <p>This is a story that will only exist for a while.</p>
        <Link href="/">Click here to go Home</Link> (...will it be go?)
      </section>
    </article>
  );
};

export default {
  title: 'Temporary/Empty',
  component: Empty,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Empty>;

const Template: ComponentStory<typeof Empty> = () => <Empty />;

export const Default = Template.bind({});
