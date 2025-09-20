import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

const ExtraChargesSection = ({
  mobileTower,
  setMobileTower,
  towerArea,
  setTowerArea,
  installationDate,
  setInstallationDate,
  showInstallationDatePicker,
  setShowInstallationDatePicker,
  hoarding,
  setHoarding,
  hoardingArea,
  setHoardingArea,
  hoardingInstallationDate,
  setHoardingInstallationDate,
  showHoardingInstallationDatePicker,
  setShowHoardingInstallationDatePicker,
  petrolPump,
  setPetrolPump,
  pumpArea,
  setPumpArea,
  pumpInstallationDate,
  setPumpInstallationDate,
  showPumpInstallationDatePicker,
  setShowPumpInstallationDatePicker,
  rainHarvesting,
  setRainHarvesting,
  completionDate,
  setCompletionDate,
  showDatePicker,
  setShowDatePicker,
  yesNoOptions,
  isRessessment = false,
  isMutation = false,
}) => {
  const isDisabled = isRessessment || isMutation;

  return (
    <View style={styles.section}>
      {/* Mobile Tower */}
      <Text style={styles.label}>Mobile Tower</Text>
      <Dropdown
        style={styles.dropdown}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Mobile Tower"
        value={mobileTower}
        onChange={item => setMobileTower(item.value)}
        disable={isDisabled}
      />
      {mobileTower === 'yes' && (
        <View style={styles.subSection}>
          <Text style={styles.label}>
            Total Area Covered by Mobile Tower & Supporting Equipments (in Sq.
            Ft.)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Eg. 200 SQMTR"
            value={towerArea}
            onChangeText={setTowerArea}
            editable={!isDisabled}
          />
          <Text style={styles.label}>
            Date of Installation of Mobile Tower *
          </Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => !isDisabled && setShowInstallationDatePicker(true)}
          >
            <Text style={{ color: installationDate ? '#000' : '#999' }}>
              {installationDate
                ? new Date(installationDate).toLocaleDateString('en-GB')
                : 'DD-MM-YYYY'}
            </Text>
          </TouchableOpacity>
          {showInstallationDatePicker && !isDisabled && (
            <DateTimePicker
              value={installationDate ? new Date(installationDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowInstallationDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setInstallationDate(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>
      )}

      {/* Hoarding */}
      <Text style={styles.label}>Does Property Have Hoarding Board(s) ? *</Text>
      <Dropdown
        style={styles.dropdown}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Does Property Have Hoarding Board(s) ? *"
        value={hoarding}
        onChange={item => setHoarding(item.value)}
        disable={isDisabled}
      />
      {hoarding === 'yes' && (
        <View style={styles.subSection}>
          <Text style={styles.label}>
            Total Area of Wall / Roof / Land (in Sq. Ft.) *
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Total Area of Wall / Roof / Land (in Sq. Ft.) *"
            value={hoardingArea}
            onChangeText={setHoardingArea}
            placeholderTextColor="#000"
            editable={!isDisabled}
          />
          <Text style={styles.label}>
            Date of Installation of Hoarding Board(s) *
          </Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() =>
              !isDisabled && setShowHoardingInstallationDatePicker(true)
            }
          >
            <Text style={{ color: hoardingInstallationDate ? '#000' : '#999' }}>
              {hoardingInstallationDate
                ? new Date(hoardingInstallationDate).toLocaleDateString('en-GB')
                : 'Date of Installation of Hoarding Board(s) *'}
            </Text>
          </TouchableOpacity>
          {showHoardingInstallationDatePicker && !isDisabled && (
            <DateTimePicker
              value={
                hoardingInstallationDate
                  ? new Date(hoardingInstallationDate)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowHoardingInstallationDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setHoardingInstallationDate(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>
      )}

      {/* Petrol Pump */}
      <Text style={styles.label}>Is property a Petrol Pump ? *</Text>
      <Dropdown
        style={styles.dropdown}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Is property a Petrol Pump ? *"
        value={petrolPump}
        onChange={item => setPetrolPump(item.value)}
        disable={isDisabled}
      />
      {petrolPump === 'yes' && (
        <View style={styles.subSection}>
          <Text style={styles.label}>
            Total Area of Petrol Pump (in Sq. Ft.) *
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Total Area of Petrol Pump (in Sq. Ft.) *"
            value={pumpArea}
            onChangeText={setPumpArea}
            placeholderTextColor="#000"
            editable={!isDisabled}
          />
          <Text style={styles.label}>Date of Installation *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() =>
              !isDisabled && setShowPumpInstallationDatePicker(true)
            }
          >
            <Text style={{ color: pumpInstallationDate ? '#000' : '#999' }}>
              {pumpInstallationDate
                ? new Date(pumpInstallationDate).toLocaleDateString('en-GB')
                : 'Date of Installation *'}
            </Text>
          </TouchableOpacity>
          {showPumpInstallationDatePicker && !isDisabled && (
            <DateTimePicker
              value={
                pumpInstallationDate
                  ? new Date(pumpInstallationDate)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPumpInstallationDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setPumpInstallationDate(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>
      )}

      {/* Rainwater Harvesting */}
      <Text style={styles.label}>Rainwater harvesting provision ? *</Text>
      <Dropdown
        style={styles.dropdown}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Rainwater harvesting provision ? *"
        value={rainHarvesting}
        onChange={item => setRainHarvesting(item.value)}
        disable={isDisabled}
      />
      {rainHarvesting === 'yes' && (
        <View style={styles.subSection}>
          <Text style={styles.label}>Completion Date of Petrol Pump *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => !isDisabled && setShowDatePicker(true)}
          >
            <Text style={{ color: completionDate ? '#000' : '#999' }}>
              {completionDate
                ? completionDate.toLocaleDateString('en-GB')
                : 'Completion Date of Petrol Pump *'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && !isDisabled && (
            <DateTimePicker
              value={completionDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setCompletionDate(selectedDate);
                }
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default ExtraChargesSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  subSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    justifyContent: 'center',
  },
});
