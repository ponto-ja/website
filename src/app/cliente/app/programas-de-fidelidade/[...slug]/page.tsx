/* eslint-disable @typescript-eslint/no-unused-vars */

import { FidelityProgramContent } from './fidelity-program-content';

type PageProps = {
  params: {
    slug: string[];
  };
};

export default function FidelityProgramPage({ params }: PageProps) {
  const [pathname] = params.slug;
  const [_, fidelityProgramId] = pathname.split('--');

  return (
    <div className="w-full">
      <FidelityProgramContent fidelityProgramId={fidelityProgramId} />
    </div>
  );
}
