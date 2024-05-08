import Head from "next/head";

const Loading = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <>
      <Head>
        <title>FMS is Loading...</title>
      </Head>
      <div className="w-full text-center my-72">
        <svg
          className="animate-bounce mx-auto"
          width="124"
          height="124"
          viewBox="0 0 192 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M136.286 106.004C136.286 124.068 120.935 138.713 102 138.713C83.0645 138.713 67.7143 124.068 67.7143 106.004C67.7143 87.9388 85.989 63.1797 102 63.1797C117.558 63.1797 136.286 87.9388 136.286 106.004Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M102.259 58.6805C121.676 58.6805 135.693 74.9627 141.141 91.2221C147.352 109.755 143.793 132.824 126.961 145.364C119.974 150.572 111.592 153.159 102.728 153.159H101.722C92.8626 153.159 84.4802 150.572 77.4935 145.364C60.6492 132.809 57.0863 109.736 63.2975 91.2032C68.7652 74.8947 82.7822 58.6616 102.267 58.6616L102.259 58.6805ZM102.259 66.0606C88.739 66.0606 79.0921 79.121 75.378 90.2024C68.0216 112.15 78.7819 136.443 101.71 136.443H102.704C125.633 136.443 136.393 112.15 129.037 90.2024C125.37 79.2041 115.719 66.0492 102.259 66.0492V66.0606Z"
            fill="#F47B20"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M76.7459 67.3296C72.5468 62.042 76.5789 54.3598 84.3569 56.1349C85.4265 56.252 85.8322 55.6515 85.4584 54.6884C82.8856 45.9222 93.6499 41.7677 99.3164 48.143C100.06 48.8795 101.066 48.8418 101.444 47.8787C101.778 34.5689 121.577 34.8635 120.344 47.8258C119.855 52.9586 113.894 56.0896 105.738 56.5126C94.0396 57.0791 84.846 59.4246 76.7459 67.3296Z"
            fill="#DD1E25"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M66.7451 84.3104L48 90.5687L60.9752 101.08L66.7451 84.3104Z"
            fill="#F47B20"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M107.078 85.1073C108.741 86.0198 110.08 87.3799 110.929 89.0156C111.777 90.6513 112.095 92.4893 111.844 94.2969C111.593 96.1046 110.782 97.8009 109.516 99.1712C108.249 100.542 106.584 101.524 104.729 101.996C102.875 102.467 100.915 102.405 99.0969 101.818C97.2793 101.231 95.6858 100.146 94.5178 98.6985C93.3498 97.2514 92.6597 95.5079 92.535 93.6884C92.4102 91.8688 92.8563 90.055 93.8169 88.4763C94.4547 87.428 95.3037 86.5093 96.3154 85.7726C97.327 85.036 98.4816 84.4958 99.713 84.183C100.944 83.8701 102.229 83.7907 103.493 83.9493C104.756 84.1079 105.975 84.5014 107.078 85.1073ZM100.648 88.4121C100.053 88.0832 99.3691 87.9294 98.682 87.9701C97.9949 88.0108 97.336 88.2442 96.7886 88.6407C96.2412 89.0372 95.8299 89.5791 95.6069 90.1977C95.3838 90.8163 95.359 91.4838 95.5355 92.1158C95.712 92.7478 96.0819 93.3159 96.5985 93.7482C97.115 94.1804 97.755 94.4574 98.4373 94.5441C99.1197 94.6308 99.8138 94.5232 100.432 94.2351C101.05 93.947 101.564 93.4912 101.909 92.9255C102.371 92.1671 102.496 91.2657 102.258 90.4194C102.02 89.5731 101.439 88.8511 100.641 88.4121H100.648Z"
            fill="#DD1E25"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M48 90.5649L62.9396 92.2192C63.043 91.8869 63.1504 91.5545 63.2617 91.2221C64.0313 88.9487 64.9477 86.7224 66.0055 84.5559L48 90.5649Z"
            fill="#F68B1F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M113.31 134.516L112.749 134.732L112.463 134.837C112.237 134.918 112.011 134.996 111.783 135.072L111.584 135.136C111.341 135.215 111.095 135.291 110.844 135.362L110.665 135.415C110.407 135.487 110.148 135.555 109.87 135.623L109.747 135.653C109.482 135.721 109.206 135.784 108.92 135.842L108.796 135.868C108.502 135.929 108.208 135.986 107.91 136.038H107.874C107.564 136.091 107.252 136.139 106.939 136.182H106.904C106.589 136.227 106.271 136.265 105.949 136.295H105.85C104.825 136.397 103.795 136.447 102.764 136.446H101.758C78.8296 136.446 68.0693 112.154 75.4258 90.2061L75.5848 89.7415V89.6849L75.7359 89.2543L75.8115 89.0428L75.899 88.8086L75.9626 88.6425L75.9904 88.5745L76.1694 88.1137L76.3602 87.6416V87.5963L76.4398 87.4036L76.5392 87.1657L76.5829 87.0637L76.6426 86.9278C76.7672 86.6382 76.8997 86.3499 77.0402 86.0628L77.068 86.0024V85.9798L77.0999 85.9156L77.2907 85.5039V85.4699L77.3862 85.2659L77.5015 85.028L77.5452 84.9373V84.9071L77.7321 84.5294L77.8395 84.3179L77.9588 84.08L78.0622 83.876V83.842L78.1854 83.6041V83.5701L78.4121 83.1471L78.5393 82.9129L78.6586 82.6976V82.6788L78.7899 82.4446V82.4219L78.9091 82.2104L79.0443 81.9763V81.946L79.1636 81.7459L79.3028 81.5117L79.5851 81.0471L79.7283 80.8168L79.8714 80.5864L80.0186 80.356C80.7542 79.2229 81.5456 78.0899 82.4045 77.0134L82.5755 76.7982L82.7464 76.5867L82.9214 76.3752L83.0964 76.1636L83.2713 75.9559L83.6292 75.5405C67.6875 86.4405 59.333 111.304 62.9516 125.116C64.037 129.086 65.9236 132.819 68.5067 136.106C83.331 148.034 110.51 143.883 121.632 129.338C133.375 118.997 137.419 100.056 131.478 82.3275C129.442 76.2543 125.911 69.6787 121.119 64.3571C115.648 60.8522 109.317 58.6918 102.275 58.6918C101.716 58.6918 101.16 58.7057 100.609 58.7333V66.1625C101.158 66.1171 101.71 66.0945 102.275 66.0945C115.735 66.0945 125.374 79.2343 129.06 90.2363C135.196 108.471 128.798 128.322 113.31 134.516Z"
            fill="#F68B1F"
          />
        </svg>
        <p className="font-normal">{text}</p>
      </div>
    </>
  );
};

export default Loading;