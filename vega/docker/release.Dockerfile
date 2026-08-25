FROM ubuntu:22.04@sha256:79676deb51ebb02885b0b9d33788e78a37cf1045ad79d1bb04c6a222c3556b3d

ARG NODE_VERSION=24.19.0
ARG NODE_SHA256=14b342e71204f811bde6153be8e04b62aef63c236fef92b55f9c83154b409647
ARG VEGA_SDK_VERSION=0.24.9914
ARG VEGA_INSTALLER_SHA256=0e5386581e5cf518202687213dd26d1b35e70242d1bd190cdea7096a99476ae0

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
        bash \
        ca-certificates \
        curl \
        git \
        jq \
        lz4 \
        libpython3-dev \
        python3 \
        xz-utils \
    && rm -rf /var/lib/apt/lists/*

RUN curl --fail --location --silent --show-error \
        --output /tmp/node.tar.xz \
        "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    && printf '%s  %s\n' "${NODE_SHA256}" /tmp/node.tar.xz | sha256sum --check --strict \
    && tar --extract --xz --file /tmp/node.tar.xz \
        --directory /usr/local --strip-components=1 \
    && rm /tmp/node.tar.xz

RUN curl --fail --location --silent --show-error \
        --output /tmp/install-vega.sh \
        https://sdk-installer.vega.labcollab.net/get_vvm.sh \
    && printf '%s  %s\n' "${VEGA_INSTALLER_SHA256}" /tmp/install-vega.sh \
        | sha256sum --check --strict \
    && NONINTERACTIVE=true VEGA_SDK_VERSION="${VEGA_SDK_VERSION}" \
        bash /tmp/install-vega.sh \
    && rm /tmp/install-vega.sh

ENV PATH="/root/vega/bin:${PATH}"

RUN node --version \
    && npm --version \
    && vega --version --json

WORKDIR /workspace
