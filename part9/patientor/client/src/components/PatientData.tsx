import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Header,
  Segment,
  Divider,
  Card,
  Icon,
  SemanticICONS,
} from 'semantic-ui-react';

import { Patient, Gender, Entry } from '../types';
import { apiBaseUrl } from '../constants';
import { useStateValue, updatePatient } from '../state';

const PatientData: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [patient, setPatient] = useState<Patient | undefined>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientData } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        setPatient(patientData);
        dispatch(updatePatient(patientData));
      } catch (error) {
        console.log(error);
      }
    };
    if (patients[id] && patients[id].ssn) {
      setPatient(patients[id]);
    } else {
      fetchPatient();
    }
  }, [id]);

  const genderIcon = (gender: Gender): SemanticICONS => {
    switch (gender) {
      case 'male':
        return 'mars';

      case 'female':
        return 'venus';

      default:
        return 'genderless';
    }
  };

  const getEntryView = (entry: Entry, lastEntry: boolean) => {
    return (
      <div key={entry.id}>
        <Header as="h3">{entry.date}</Header>
        <p>{entry.description}</p>
        {entry.diagnosisCodes && (
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        )}
        {!lastEntry && <Divider section />}
      </div>
    );
  };

  const totalEntries = patient ? patient.entries.length : 0;

  return (
    <>
      {patient && (
        <section>
          <Card>
            <Card.Content header={patient.name} />
            <Card.Content description={`occupation: ${patient.occupation}`} />
            <Card.Content extra>
              <Icon name={genderIcon(patient.gender)} />
              {patient.ssn}
            </Card.Content>
          </Card>
          {totalEntries > 0 && (
            <>
              <h3>entries</h3>
              <Segment>
                {patient.entries.map((entry, index) =>
                  getEntryView(entry, index + 1 === totalEntries)
                )}
              </Segment>
            </>
          )}
        </section>
      )}
    </>
  );
};

export default PatientData;
