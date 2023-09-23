enum CriaLocalizada {
    'NÃO' = 0,
    'SIM' = 1,
    'VERIFICAÇÃO NÃO POSSIVEL' = 2,
    'NÃO HAVIA CRIA' = 3,
}

enum QuantidadeCria {
    'SEM CRIA' = 0,
    'POUCA CRIA' = 1,
    'MUITA CRIA' = 2
}

enum EstadoCriaNova {
    'CRIA EM OVOS' = 0,
    'CRIA EM PUPAS' = 1,
    'CRIA EM OVOS E PUPAS' = 2
}

enum EstadoCriaMadura {
    'CRIA MADURA ESCURAS' = 0,
    'CRIA MADURA CLARAS' = 1,
    'CRIA MADURA ESCURAS E CLARAS' = 2
}

enum MelLocalizado {
    'NÃO' = 0,
    'SIM' = 1,
    'VERIFICAÇÃO NÃO POSSIVEL' = 2,
    'NÃO HAVIA MEL' = 3
}

enum QuantidadeMel {
    'SEM MEL' = 0,
    'POUCO MEL' = 1,
    'MUITO MEL' = 2
}

enum EstadoMel {
    'MEL MADURO' = 0,
    'MEL VERDE' = 1,
    'MEL MADURO E VERDE' = 2
}

enum PolenLocalizado {
    'NÃO' = 0,
    'SIM' = 1,
    'VERIFICAÇÃO NÃO POSSIVEL' = 2,
    'NÃO HAVIA POLEN' = 3
}

enum QuantidadePolen {
    'SEM POLEN' = 0,
    'POUCO POLEN' = 1,
    'MUITO POLEN' = 2
}

enum RainhaLocalizada {
    'NÃO' = 0,
    'SIM' = 1,
    'VERIFICAÇÃO NÃO POSSIVEL' = 2,
    'NÃO HAVIA RAINHA' = 3
}

enum EstadoRainha {
    'RAINHA COM IDADE CONHECIDA' = 0,
    'RAINHA COM IDADE DESCONHECIDA' = 1,
}

enum AspectoRainha {
    'RAINHA JOVEM SAUDÁVEL' = 0,
    'RAINHA JOVEM ASPECTO MEDIANO' = 1,
    'RAINHA VELHA NÃO SAUDÁVEL' = 2,
}

export {
	CriaLocalizada,
	QuantidadeCria,
	EstadoCriaNova,
	EstadoCriaMadura,
	MelLocalizado,
	QuantidadeMel,
	EstadoMel,
	PolenLocalizado,
	QuantidadePolen,
	RainhaLocalizada,
	EstadoRainha,
	AspectoRainha
}