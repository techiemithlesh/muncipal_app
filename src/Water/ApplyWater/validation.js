// formValidation.js
export const scrollToInput = (inputRef, scrollViewRef) => {
  if (inputRef && scrollViewRef?.current) {
    inputRef.measureLayout(
      scrollViewRef.current,
      (x, y) => {
        scrollViewRef.current.scrollTo({ y: y, animated: true });
        inputRef.focus();
      },
      error => console.log('measureLayout error:', error)
    );
  }
};

export const handleValidation = ({
  totalArea,
  landmark,
  pin,
  address,
  applicants,
  kNo,
  bindBookNo,
  accountNo,
  electricityType,
  totalAreaRef,
  landmarRef,
  pincodeRef,
  addressRef,
  applicantRefs,
  khataNoRef,
  bindBookNoRef,
  electricityTypeRef,
  scrollViewRef,
  setError
}) => {
  const newError = {};

  if (!totalArea) {
    newError.totalArea = 'Total area is required';
    setError(newError);
    scrollToInput(totalAreaRef.current, scrollViewRef);
    return false;
  }

  if (!landmark) {
    newError.landmark = 'Landmark is required';
    setError(newError);
    scrollToInput(landmarRef.current, scrollViewRef);
    return false;
  }

  if (!pin) {
    newError.pin = 'Pin code is required';
    setError(newError);
    scrollToInput(pincodeRef.current, scrollViewRef);
    return false;
  }

  if (!address) {
    newError.address = 'Address is required';
    setError(newError);
    scrollToInput(addressRef.current, scrollViewRef);
    return false;
  }

  // Validate applicants
  for (let index = 0; index < applicants.length; index++) {
    const applicant = applicants[index];

    if (!applicant.ownerName) {
      newError[`ownerName-${index}`] = 'Owner name is required';
      setError(newError);
      scrollToInput(applicantRefs.current[index * 2], scrollViewRef);
      return false;
    }

    if (!applicant.mobileNo) {
      newError[`mobileNo-${index}`] = 'Mobile number is required';
      setError(newError);
      scrollToInput(applicantRefs.current[index * 2 + 1], scrollViewRef);
      return false;
    }
  }

  if (!kNo) {
    newError.kNo = 'Khata No is required';
    setError(newError);
    scrollToInput(khataNoRef.current, scrollViewRef);
    return false;
  }

  if (!bindBookNo) {
    newError.bindBookNo = 'Bind Book is required';
    setError(newError);
    scrollToInput(bindBookNoRef.current, scrollViewRef);
    return false;
  }

  if (!accountNo) {
    newError.accountNo = 'Account No required';
    setError(newError);
    scrollToInput(addressRef.current, scrollViewRef);
    return false;
  }

  if (!electricityType) {
    newError.electricityType = 'Electricity Type is required';
    setError(newError);
    scrollToInput(electricityTypeRef.current, scrollViewRef);
    return false;
  }

  setError({});
  return true;
};
