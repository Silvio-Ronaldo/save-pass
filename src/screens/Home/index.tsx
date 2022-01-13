import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
  LoginContainer,
  Trash,
  TrashIcon,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = '@savepass:logins';
    const response = await AsyncStorage.getItem(dataKey);
    const logins = response ? JSON.parse(response) : [];

    setData(logins);
    setSearchListData(logins);
  }

  function handleFilterLoginData() {
    if (searchText !== '') {
      const service = data.filter(login => login.service_name === searchText);
      setSearchListData(service);
      return
    }

    setSearchListData(data);
  }

  function handleChangeInputText(text: string) {
    setSearchText(text);
  }

  async function handleConfirmRemoveLogin(id: string) {
    const dataKey = '@savepass:logins';
    const response = await AsyncStorage.getItem(dataKey);
    const logins = response ? JSON.parse(response) : [];

    const loginsFiltered = logins.filter(login => login.id !== id);

    if (loginsFiltered.length === 0) {
      await AsyncStorage.removeItem(dataKey);
    } else {
      await AsyncStorage.setItem(dataKey, JSON.stringify(loginsFiltered));
    }

    loadData();
  }

  async function handleRemoveLogin(id: string, name: string) {
    Alert.alert(
      'Remover a senha', 
      `Quer mesmo remover a senha de ${name}?`, 
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        { 
          text: "Sim", 
          onPress: () => handleConfirmRemoveLogin(id)
        },
      ],
      {
        cancelable: true,
      }
    )
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Silvio Ronaldo',
          avatar_url: 'https://github.com/Silvio-Ronaldo.png',
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return (
              <LoginContainer>
                <LoginDataItem
                  service_name={loginData.service_name}
                  email={loginData.email}
                  password={loginData.password}
                />

                <Trash onPress={() => handleRemoveLogin(loginData.id, loginData.service_name)}>
                  <TrashIcon name="trash-2" />
                </Trash>
              </LoginContainer>
            )
          }}
        />
      </Container>
    </>
  )
}