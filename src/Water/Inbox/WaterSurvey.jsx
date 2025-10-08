import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import VerificationCard from '../../PropertyMenu/VerificationCard';
import HeaderNavigation from '../../Components/HeaderNavigation';
import { useWaterMasterData } from './BackendData/FieldVerificarionData';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchFieldVerificationData } from './BackendData/fetchFieldVerificationData';

const WaterSurvey = () => {
  const route = useRoute();
  const { id } = route.params || {};
  const navigation = useNavigation();

  console.log('🆔 Received ID:', id);
  const [selectedTsMap, setSelectedTsMap] = useState(null);

  const [fealureSize, setfealureSize] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState([]);

  // dropdown selections
  const [selectedPipelineType, setSelectedPipelineType] = useState(null);
  const [selectedPipeDelimeter, setSelectedPipeDelimeter] = useState(null);
  const [selectedPipeQuality, setSelectedPipeQuality] = useState(null);
  const [selectedRoadType, setSelectedRoadType] = useState(null);

  // verification & input states
  const [wardVerification, setWardVerification] = useState(null);
  const [wardDropdown, setWardDropdown] = useState('');

  const [propertyTypeVerification, setPropertyTypeVerification] =
    useState(null);
  const [propertyTypeDropdown, setPropertyTypeDropdown] = useState('');

  const [pipelineTypeVerification, setPipelineTypeVerification] =
    useState(null);
  const [pipelineTypeDropdown, setPipelineTypeDropdown] = useState('');

  const [connectionTypeVerification, setConnectionTypeVerification] =
    useState(null);
  const [connectionTypeDropdown, setConnectionTypeDropdown] = useState('');

  const [categoryVerification, setCategoryVerification] = useState(null);
  const [categoryDropdown, setCategoryDropdown] = useState('');

  const [areaVerification, setAreaVerification] = useState(null);
  const [areaInput, setAreaInput] = useState('');

  const [newWardVerification, setNewWardVerification] = useState(null);
  const [newWardDropdown, setNewWardDropdown] = useState(null);

  const [pinelineSizeVerification, setPinelineSizeVerification] =
    useState(null);
  const [pinelineSize, setPinelineSize] = useState('');

  const [data, setData] = useState(null);
  const [loadingData, setLoading] = useState(true);
  const [fullPayload, setFullPayload] = useState(null);

  const permissibleFerruleSizes = [
    { label: '10 mm', value: '1' },
    { label: '20 mm', value: '2' },
  ];

  const {
    ferruleType,
    roadTypeOptions,
    tsMapOptions,
    ownershipType,
    propertyTypeOptions,
    connectionType,
    categoryTypeOptions,
    pipelineTypeOptions,
    distributedPipelineTypeOptions,
    permittedPipeDiameterOptions,
    permittedPipeQualityOptions,
    connectionThrough,
    wardOptions,
    newWardOptions,
    loading,
    error,
    fetchNewWardByOldWard,
    fetchVarification,
  } = useWaterMasterData();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchFieldVerificationData(id);
        setData(result?.data);
        console.log('Fetched Data:', result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);

  useEffect(() => {
    if (wardDropdown) {
      fetchNewWardByOldWard(wardDropdown);
    }
  }, [wardDropdown, id]);

  if (loadingData) return <ActivityIndicator size="large" color="#0891b2" />;

  const handleAddNewWard = () => {
    const findLabel = (options, value) => {
      const item = options?.find(opt => opt.value === value);
      return item ? { id: item.value, label: item.label } : null;
    };
    const selectedTsMapObj = tsMapOptions.find(m => m.value === selectedTsMap);

    const payload = {
      connectionThroughId: data?.connectionThroughId,
      id: { id },
      wardNo: {
        selfAssessedValue: { id: data?.wardMstrId, label: data?.wardNo },
        verifiedValue:
          wardVerification === 'Correct'
            ? { id: data?.wardMstrId, label: data?.wardNo }
            : wardVerification === 'Incorrect'
            ? findLabel(wardOptions, wardDropdown)
            : null,
        status: wardVerification || 'Not Verified',
      },
      newWardNo: {
        selfAssessedValue: { id: data?.newWardMstrId, label: data?.newWardNo },

        verifiedValue:
          newWardVerification === 'Correct'
            ? { id: data?.newWardMstrId, label: data?.newWardNo }
            : newWardVerification === 'Incorrect'
            ? findLabel(newWardOptions, newWardDropdown)
            : null,
        status: newWardVerification || 'Not Verified',
      },
      propertyType: {
        selfAssessedValue: {
          id: data?.propertyTypeId,
          label: data?.propertyType,
        },

        verifiedValue:
          propertyTypeVerification === 'Correct'
            ? { id: data?.propertyTypeId, label: data?.propertyType }
            : propertyTypeVerification === 'Incorrect'
            ? findLabel(propertyTypeOptions, propertyTypeDropdown)
            : null,
        status: propertyTypeVerification || 'Not Verified',
      },
      pipelineType: {
        selfAssessedValue: {
          id: data?.pipelineTypeId,
          label: data?.pipelineType,
        },
        verifiedValue:
          pipelineTypeVerification === 'Correct'
            ? { id: data?.pipelineTypeId, label: data?.pipelineType }
            : pipelineTypeVerification === 'Incorrect'
            ? findLabel(pipelineTypeOptions, pipelineTypeDropdown)
            : null,
        status: pipelineTypeVerification || 'Not Verified',
      },
      connectionType: {
        selfAssessedValue: {
          id: data?.connectionTypeId,
          label: data?.connectionType,
        },
        verifiedValue:
          connectionTypeVerification === 'Correct'
            ? { id: data?.connectionTypeId, label: data?.connectionType }
            : connectionTypeVerification === 'Incorrect'
            ? findLabel(connectionType, connectionTypeDropdown)
            : null,
        status: connectionTypeVerification || 'Not Verified',
      },
      category: {
        selfAssessedValue: { id: 1, label: 'APL' },
        verifiedValue:
          categoryVerification === 'Correct'
            ? { id: data?.category, label: data?.category }
            : categoryVerification === 'Incorrect'
            ? findLabel(categoryTypeOptions, categoryDropdown)
            : null,
        status: categoryVerification || 'Not Verified',
      },
      area: {
        selfAssessedValue: { id: data?.areaSqft, label: data?.areaSqft },
        verifiedValue:
          areaVerification === 'Correct'
            ? { id: data?.areaSqft, label: data?.areaSqft }
            : areaVerification === 'Incorrect'
            ? { id: areaInput, label: areaInput }
            : null,
        status: areaVerification || 'Not Verified',
      },
      pinelineSize: {
        selfAssessedValue: { id: '', label: '6' },
        verifiedValue:
          pinelineSizeVerification === 'Correct'
            ? { id: pinelineSize, label: pinelineSize }
            : pinelineSizeVerification === 'Incorrect'
            ? { id: pinelineSize, label: pinelineSize }
            : null,
        status: pinelineSizeVerification || 'Not Verified',
      },
      pipelineDisturbationType: findLabel(
        distributedPipelineTypeOptions,
        selectedPipelineType,
      ),
      pipeDelimeter: findLabel(
        permittedPipeDiameterOptions,
        selectedPipeDelimeter,
      ),
      pipeQuality: findLabel(permittedPipeQualityOptions, selectedPipeQuality),
      roadType: findLabel(roadTypeOptions, selectedRoadType),
      tsMap: selectedTsMapObj
        ? {
            id: selectedTsMapObj.value,
            label: selectedTsMapObj.label,
            img: selectedTsMapObj.img,
          }
        : null,

      pinelineSize: {
        selfAssessedValue: { id: '', label: '6' },
        verifiedValue:
          pinelineSizeVerification === 'Correct'
            ? { id: pinelineSize, label: pinelineSize }
            : pinelineSizeVerification === 'Incorrect'
            ? { id: pinelineSize, label: pinelineSize }
            : null,
        status: pinelineSizeVerification || 'Not Verified',
      },

      fealureSize: fealureSize ? findLabel(ferruleType, fealureSize) : null,
    };
    setFullPayload(payload);
    console.log('✅ Final Payload with IDs & Labels:', payload);

    // Convert for preview modal
    const modalData = [
      {
        label: 'Ward No',
        self: payload.wardNo.selfAssessedValue.label,
        verified: payload.wardNo.verifiedValue?.label,
        status: payload.wardNo.status,
      },
      {
        label: 'New Ward No',
        self: payload.newWardNo.selfAssessedValue.label || '-',
        verified: payload.newWardNo.verifiedValue?.label,
        status: payload.newWardNo.status,
      },
      {
        label: 'Property Type',
        self: payload.propertyType.selfAssessedValue.label,
        verified: payload.propertyType.verifiedValue?.label,
        status: payload.propertyType.status,
      },
      {
        label: 'Pipeline Type',
        self: payload.pipelineType.selfAssessedValue.label,
        verified: payload.pipelineType.verifiedValue?.label,
        status: payload.pipelineType.status,
      },
      {
        label: 'Connection Type',
        self: payload.connectionType.selfAssessedValue.label,
        verified: payload.connectionType.verifiedValue?.label,
        status: payload.connectionType.status,
      },
      {
        label: 'Category',
        self: payload.category.selfAssessedValue.label,
        verified: payload.category.verifiedValue?.label,
        status: payload.category.status,
      },
      {
        label: 'Area (Sq ft)',
        self: payload.area.selfAssessedValue.label,
        verified: payload.area.verifiedValue?.label,
        status: payload.area.status,
      },
      {
        label: 'Pipeline Size (MM)',
        self: '-', // or use self-assessed value if you want
        verified: pinelineSize || '-', // take the input directly
        status: pinelineSize ? 'Entered' : 'Not Entered',
      },

      {
        label: 'Pipeline Disturbation Type',
        self: '-',
        verified: payload.pipelineDisturbationType?.label,
        status: payload.pipelineDisturbationType ? 'Selected' : '-',
      },
      {
        label: 'Pipe Delimeter',
        self: '-',
        verified: payload.pipeDelimeter?.label,
        status: payload.pipeDelimeter ? 'Selected' : '-',
      },
      {
        label: 'Pipe Quality',
        self: '-',
        verified: payload.pipeQuality?.label,
        status: payload.pipeQuality ? 'Selected' : '-',
      },
      {
        label: 'Road Type',
        self: '-',
        verified: payload.roadType?.label,
        status: payload.roadType ? 'Selected' : '-',
      },
      {
        label: 'TS Map',
        self: '-',
        verified: payload.tsMap?.label || '-',
        status: payload.tsMap ? 'Selected' : '-',
      },
    ];

    setModalTitle('Form Submission Preview');
    setModalContent(modalData);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNavigation />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Bar */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            {data?.applicationNo || 'Application No: N/A'}
          </Text>
          <Text style={styles.infoText}>Applied Date: 31-Jan-2025</Text>
        </View>

        {/* Verification Fields */}
        <VerificationCard
          label="Ward No."
          value={data?.wardNo || ''}
          dropdownOptions={wardOptions}
          selectedVerification={wardVerification}
          setSelectedVerification={setWardVerification}
          dropdownValue={wardDropdown}
          setDropdownValue={setWardDropdown}
        />
        <VerificationCard
          label="New Ward No."
          value={data?.newWardNo}
          dropdownOptions={newWardOptions}
          selectedVerification={newWardVerification}
          setSelectedVerification={setNewWardVerification}
          dropdownValue={newWardDropdown}
          setDropdownValue={setNewWardDropdown}
          disabled={!wardDropdown}
        />
        <VerificationCard
          label="Property Type"
          value={data?.propertyType}
          dropdownOptions={propertyTypeOptions}
          selectedVerification={propertyTypeVerification}
          setSelectedVerification={setPropertyTypeVerification}
          dropdownValue={propertyTypeDropdown}
          setDropdownValue={setPropertyTypeDropdown}
        />
        <VerificationCard
          label="Pipeline Type"
          value={data?.pipelineType}
          dropdownOptions={pipelineTypeOptions}
          selectedVerification={pipelineTypeVerification}
          setSelectedVerification={setPipelineTypeVerification}
          dropdownValue={pipelineTypeDropdown}
          setDropdownValue={setPipelineTypeDropdown}
        />
        <VerificationCard
          label="Connection Type"
          value={data?.connectionType}
          dropdownOptions={connectionType}
          selectedVerification={connectionTypeVerification}
          setSelectedVerification={setConnectionTypeVerification}
          dropdownValue={connectionTypeDropdown}
          setDropdownValue={setConnectionTypeDropdown}
        />
        <VerificationCard
          label="Category"
          value={data?.category}
          dropdownOptions={categoryTypeOptions}
          selectedVerification={categoryVerification}
          setSelectedVerification={setCategoryVerification}
          dropdownValue={categoryDropdown}
          setDropdownValue={setCategoryDropdown}
        />
        {/*Connection Through - Skipped as per new design */}

        {/* Area of Plot */}
        <VerificationCard
          label="Area of Plot(in Sq ft)"
          value={data?.areaSqft}
          selectedVerification={areaVerification}
          setSelectedVerification={setAreaVerification}
          showInputOnIncorrect={true}
          inputValue={areaInput}
          setInputValue={setAreaInput}
          inputLabel="Enter Area (Sq ft):"
          inputPlaceholder="Enter area in square feet"
        />

        {/* Pipeline Size */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            Disturbation Pipeline Size (in MM)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pipeline size"
            value={pinelineSize}
            onChangeText={setPinelineSize}
            keyboardType="numeric"
          />
        </View>

        {/* Ferule Size */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Permissible Ferule Size</Text>
          <Dropdown
            style={styles.dropdown}
            data={ferruleType}
            labelField="label"
            valueField="value"
            placeholder="Select Ferrule Size"
            value={fealureSize}
            onChange={item => setfealureSize(item.value)}
          />
        </View>

        {/* More Dropdowns */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pipeline Disturbation Type</Text>
          <Dropdown
            style={styles.dropdown}
            data={distributedPipelineTypeOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Pipeline Type"
            value={selectedPipelineType}
            onChange={item => setSelectedPipelineType(item.value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Permissible Pipe Delimeter</Text>
          <Dropdown
            style={styles.dropdown}
            data={permittedPipeDiameterOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Pipe Delimeter"
            value={selectedPipeDelimeter}
            onChange={item => setSelectedPipeDelimeter(item.value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Permissible Pipe Quality</Text>
          <Dropdown
            style={styles.dropdown}
            data={permittedPipeQualityOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Pipe Quality"
            value={selectedPipeQuality}
            onChange={item => setSelectedPipeQuality(item.value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Road Type</Text>
          <Dropdown
            style={styles.dropdown}
            data={roadTypeOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Road Type"
            value={selectedRoadType}
            onChange={item => setSelectedRoadType(item.value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Select TS Map</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          >
            {tsMapOptions.map(item => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.tsMapCard,
                  selectedTsMap === item.value && styles.selectedTsMapCard,
                ]}
                onPress={() => setSelectedTsMap(item.value)}
              >
                <Image
                  source={{ uri: item.img }}
                  style={styles.tsMapImage}
                  resizeMode="cover"
                />
                <Text style={styles.tsMapLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNewWard}>
            <Text style={styles.addButtonText}>Preview Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <ScrollView
              style={{ maxHeight: responsiveHeight(50), marginBottom: 10 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: '#000',
                }}
              >
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Field</Text>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Self</Text>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Verified</Text>
                <Text style={{ flex: 1, fontWeight: 'bold' }}>Status</Text>
              </View>

              {modalContent.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 6,
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#ccc',
                  }}
                >
                  <Text style={{ flex: 1 }}>{item.label}</Text>
                  <Text style={{ flex: 1 }}>{item.self || '-'}</Text>
                  <Text style={{ flex: 1 }}>{item.verified || '-'}</Text>
                  <Text
                    style={{
                      flex: 1,
                      color:
                        item.status === 'Correct'
                          ? 'green'
                          : item.status === 'Incorrect'
                          ? 'red'
                          : 'black',
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#0891b2' }]}
                onPress={() => {
                  console.log('Form Submitted:', modalContent);
                  setIsModalVisible(false);
                  navigation.navigate('SubmitSurey', {
                    data: fullPayload,
                    modalData: modalContent,
                  });
                }}
              >
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: responsiveFontSize(1.6),
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#059669',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1),
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  infoBar: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    margin: 15,
  },
  infoText: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  addButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },

  section: {
    backgroundColor: '#fff',
    padding: responsiveWidth(2),
    marginVertical: responsiveHeight(0.5),
    marginHorizontal: responsiveWidth(3),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    color: 'white',
    fontWeight: '500',
    fontSize: responsiveFontSize(1.8),
  },
  tsMapCard: {
    width: responsiveWidth(40),
    marginRight: responsiveWidth(3),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },
  selectedTsMapCard: {
    borderColor: '#0891b2',
    borderWidth: 2,
  },
  tsMapImage: {
    width: '100%',
    height: responsiveHeight(15),
  },
  tsMapLabel: {
    paddingVertical: 5,
    fontSize: responsiveFontSize(1.6),
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default WaterSurvey;
