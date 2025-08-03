import api from '@/services/api';
import { useUser } from '@/services/UserContext';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export default function ModalAgregarLibro({
  modalVisible,
  setModalVisible,
  refetch,
  isLoading,
}: Props) {
  const [codigo, setCodigo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { userData } = useUser();

  async function agregarLibro() {
    const formatedCodigo = codigo.trim();
    try {
      const res = await api.post('/api/validarcodigo', {
        codigo: formatedCodigo,
        idusuario: userData?.idusuario || 0,
        id_institucion: userData?.institucion.idInstitucion || 'ATEST1',
      });

      const { status, message } = res.data;

      setErrorMessage('');
      setSuccessMessage('');

      switch (status) {
        case '1':
          setSuccessMessage('¡Libro agregado correctamente!');
          await refetch();
          break;
        case '5':
          setErrorMessage(message || 'El código es de prueba diagnóstica.');
          break;
        case '3':
          setErrorMessage('El código está bloqueado.');
          break;
        case '4':
          setErrorMessage('El código ha sido devuelto.');
          break;
        case '2':
          setErrorMessage('El código no existe.');
          break;
        case '0':
          setErrorMessage('El código ya está registrado.');
          break;
        default:
          setErrorMessage('Error desconocido.');
          break;
      }
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response);
      setErrorMessage('Error al conectar con el servidor.');
      setSuccessMessage('');
    }
  }

  const handleClose = async () => {
    setModalVisible(false);
    setCodigo('');
    setSuccessMessage('');
    setErrorMessage('');
    await refetch()
  };

  // Auto-cerrar el modal solo si fue exitoso
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        handleClose();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-gray-800 w-10/12 rounded-xl p-6">
          {/* Título */}
          <Text className="text-xl font-semibold text-gray-100 mb-2">
            Agregar libro
          </Text>

          {/* Descripción */}
          <Text className="mb-2 p-2 text-green-700 bg-green-100 rounded-lg">
            Ingresa el código de tu libro
          </Text>

          {/* Mensajes */}
          {successMessage ? (
            <Text className="mb-2 text-green-400">{successMessage}</Text>
          ) : null}
          {errorMessage ? (
            <Text className="mb-2 text-red-400">{errorMessage}</Text>
          ) : null}

          {/* Input */}
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-gray-100"
            placeholder="Ej. MLE3-KJVBXXXXXX-XXX"
            value={codigo}
            onChangeText={setCodigo}
          />

          {/* Botones */}
          <View className="flex-row justify-end space-x-2 gap-5 w-full">
            <TouchableOpacity
              onPress={agregarLibro}
              disabled={codigo.length < 1 || isLoading}
              className="px-4 py-2 rounded-lg flex-1 bg-blue-600">
              <Text className="text-white font-medium text-center">
                {isLoading ? 'Añadiendo...' : 'Aceptar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClose}
              className="px-4 py-2 rounded-lg flex-1 bg-gray-300">
              <Text className="text-gray-800 font-medium text-center">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
