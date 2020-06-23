import React, { useState, FormEvent, useEffect } from 'react'
import { Title, Form, Repositories, Error } from './styles'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api'
import logoImg from '../../assets/logo.svg'

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string,
        avatar_url: string,
    }
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('')
    const [ inputError, setInputError ] = useState('')
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const repositoriesStorage = localStorage.getItem('@GithubExplorer:repositories')
        if(repositoriesStorage){
            return JSON.parse(repositoriesStorage)
        }

        return []
    })

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function handleAddrepository(event: FormEvent<HTMLFormElement>): Promise<any> {
        event.preventDefault()

        if(!newRepo){
            setInputError('Digite o autor/nome do repositóorio')
            return false
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`)
            const repository = response.data

            setRepositories([...repositories, repository])
            setNewRepo('')
            setInputError('')
        } catch (error) {
            setInputError('Erro ao buscar esse repositório')
        }

    }
    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore Repositórios no Github</Title>
            <Form action="" hasError={ !!inputError } onSubmit={handleAddrepository}>
                <input
                    type="text"
                    placeholder="Digite o nome do repositório"
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                />
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error> { inputError } </Error>}
            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`repositories/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard
