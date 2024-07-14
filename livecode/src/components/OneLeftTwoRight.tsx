// import AgreementPage from "../condition"

import React from 'react';

interface Props {
    Tab1: any;
    Tab2: any;
    Tab3: any;
  }

const OneTwoComponent: React.FC<Props> = ({ Tab1, Tab2, Tab3 }) => {
  return (
    <div className="flex flex-col w-full lg:flex-row">
      <div className="lg:w-2/5 p-2"> {/* Left component */}
        <Tab1 />
      </div>
      <div className="lg:w-3/5 w-full flex flex-col">
        <div className="m-2"> {/* Right top component */}
          <Tab2 />
        </div>
        <div className="m-1"> {/* Right bottom component */}
          <Tab3 />
        </div>
      </div>
    </div>
  );
};

export default OneTwoComponent;
