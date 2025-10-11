useEffect(() => {
  if (roleId === 15) {
    // Create a prefilled "TC verified data" object based on fetched data
   

    // Also prefill all form fields directly
    setWardVerification(tcData.wardVerification);
    setNewWardVerification(tcData.newWardVerification);
    setPropertyTypeVerification(tcData.propertyTypeVerification);
    setPipelineTypeVerification(tcData.pipelineTypeVerification);
    setConnectionTypeVerification(tcData.connectionTypeVerification);
    setCategoryVerification(tcData.categoryVerification);
    setAreaVerification(tcData.areaVerification);
    setPinelineSizeVerification(tcData.pinelineSizeVerification);

    setWardDropdown(tcData.wardDropdown);
    setNewWardDropdown(tcData.newWardDropdown);
    setPropertyTypeDropdown(tcData.propertyTypeDropdown);
    setPipelineTypeDropdown(tcData.pipelineTypeDropdown);
    setConnectionTypeDropdown(tcData.connectionTypeDropdown);
    setCategoryDropdown(tcData.categoryDropdown);
    setAreaInput(tcData.areaInput);
    setPinelineSize(tcData.pinelineSize);
    setfealureSize(tcData.fealureSize);
    setSelectedPipelineType(tcData.selectedPipelineType);
    setSelectedPipeDelimeter(tcData.selectedPipeDelimeter);
    setSelectedPipeQuality(tcData.selectedPipeQuality);
    setSelectedRoadType(tcData.selectedRoadType);
    setSelectedTsMap(tcData.selectedTsMap);
  }
}, [ roleId]);
