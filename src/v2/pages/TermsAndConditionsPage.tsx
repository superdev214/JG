import '../../styles/common.css';
import '../components/TermsAndConditions_white.scss';
import 'twin.macro';

import TermsAndConditions from '../components/TermsAndConditions';

const TermsAndConditionsPage = () => {
  return (
    <div
      className="text-white"
      tw="mx-auto px-1 md:px-10 max-w-[1220px] min-h-[calc(100vh - 228px)] flex justify-center items-center text-white"
    >
      <TermsAndConditions />
    </div>
  );
};

export default TermsAndConditionsPage;
