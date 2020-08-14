export const mapVisitorData = (data) => {
  const { kind, reference, ...visitor } = data;

  if (visitor.isInternal && typeof visitor.isInternal === 'string') {
    if (visitor.isInternal === 'MINARM') visitor.isInternal = true;
    if (visitor.isInternal === 'HORS MINARM') visitor.isInternal = false;
  }

  if (visitor.vip && typeof visitor.vip === 'string') {
    if (visitor.vip === 'TRUE') visitor.vip = true;
    if (visitor.vip === 'FALSE') visitor.vip = false;
  }

  return { ...visitor, identityDocuments: { kind, reference } };
};

export const mapVisitorEdit = (data) => ({
  ...data,
  isInternal: data.isInternal ? 'MINARM' : 'HORS MINARM',
  vip: data.vip ? 'TRUE' : 'FALSE',
  kind: data.identityDocuments[0].kind,
  reference: data.identityDocuments[0].reference,
  birthday: new Date(data.birthday),
});

export const mapRequestEdit = (data) => ({
  from: new Date(data.from),
  to: new Date(data.to),
  object: data.object,
  reason: data.reason,
});

export default {};
