import React, { useState, useEffect } from "react";
import { get } from "lodash";
import { isEmail, isInt, isFloat } from "validator";
import { PropTypes } from "prop-types";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

import axios from "../../services/axios";
import history from "../../services/history";
import { Container } from "../../styles/GlobalStyles";
import { Form, ProfilePicture, Title } from "./styled";
import Loading from "../../components/Loading";
import * as actions from "../../store/modules/auth/actions";

export default function Aluno(match) {
  const dispatch = useDispatch();

  const id = get(match, "match.params.id", "");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [foto, setFoto] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/alunos/${id}`);
        const Foto = get(data, "Fotos[0].url", "");

        setFoto(Foto);

        setNome(get(data, "nome", ""));
        setSobrenome(get(data, "sobrenome", ""));
        setEmail(get(data, "email", ""));
        setIdade(get(data, "idade", ""));
        setPeso(get(data, "peso", ""));
        setAltura(get(data, "altura", ""));

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, "response.status", 0);
        const errors = get(err, "response.data.errors", []);

        if (status === 400) errors.map((error) => toast.error(error));
        history.push("/");
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      toast.error("Nome precisa ter entre 3 e 255 caracteres");
      formErrors = true;
    }

    if (sobrenome.length < 3 || sobrenome.length > 255) {
      toast.error("Sobrenome precisa ter entre 3 e 255 caracteres");
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error("Email inválido");
      formErrors = true;
    }

    if (!isInt(String(idade))) {
      toast.error("Idade precisa ser um número inteiro");
      formErrors = true;
    }

    if (!isFloat(String(peso))) {
      toast.error("Peso precisa ser um número");
      formErrors = true;
    }

    if (!isFloat(String(altura))) {
      toast.error("Altura precisa ser um número");
      formErrors = true;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        await axios.put(`/alunos/${id}`, {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });

        toast.success("Aluno(a) editado(a) com sucesso!");
      } else {
        const { data } = await axios.post("/alunos", {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        });
        toast.success("Aluno(a) criado(a) com sucesso!");
        history.push(`/aluno/${data.id}/edit`);
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      const status = get(err, "response.status", 0);
      // const data = get(err, "response.data", {});
      const errors = get(err, "response.data.errors", {});

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error("Ocorreu um erro ao salvar o aluno(a)");
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? "Editar Aluno" : "Novo Aluno"}</Title>
      <Form onSubmit={handleSubmit}>
        {id && (
          <ProfilePicture>
            {foto ? <img src={foto} alt={nome} /> : <FaUserCircle size={180} />}
            <Link to={`/fotos/${id}`}>
              <FaEdit size={24} />
            </Link>
          </ProfilePicture>
        )}
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label htmlFor="sobrenome">
          Sobrenome:
          <input
            type="text"
            placeholder="Digite seu sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
        </label>
        <label htmlFor="email">
          E-mail:
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="idade">
          Idade:
          <input
            type="number"
            placeholder="Digite sua idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
        </label>
        <label htmlFor="peso">
          Peso:
          <input
            type="number"
            placeholder="Digite seu peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
        </label>
        <label htmlFor="altura">
          Altura:
          <input
            type="number"
            placeholder="Digite sua altura"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
          />
        </label>

        <button type="submit">{id ? "Salvar" : "Criar"}</button>
      </Form>
    </Container>
  );
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
